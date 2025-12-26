const express = require("express");
const cors = require("cors");
const readingWritingDatabase = require('./readingWritingDatabase');
const fs = require("fs");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");
const apiDocsFile = fs.readFileSync("./src/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(apiDocsFile);

let DOMPurify;

try {
    if(process.env.NODE_ENV === "test") {
        DOMPurify = {
            sanitize: (x) => x.replace(/<script.*?>.*?<\/script>/gi, ""),
        };
    }
    else{
        const { JSDOM } = require("jsdom");
        const createDOMPurify = require("dompurify");
        const window = new JSDOM("").window;
        DOMPurify = createDOMPurify(window);
    }
}
catch(e){
    DOMPurify = {
        sanitize: (x) => x.replace(/<script.*?>.*?<\/script>/gi, ""),
    };
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const rwDB = new readingWritingDatabase(
    process.env.NODE_ENV === "test" ? "test/tasks.test.json" : "src/tasks.json"
);

app.get('/tasks', (req, res) => {
    const tasks = rwDB.readTasks().map(task => ({
        ...task,
        title: DOMPurify.sanitize(task.title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        description: DOMPurify.sanitize(task.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    }));
    res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
    let {title, description="", status="todo", date, time } = req.body;

    if(title.length <= 0 || title.length > 100){
        return res.status(400).json({ error: "Invalid title" });
    }
    if(description.length > 500){
        return res.status(400).json({ error: "Invalid description" });
    }

    title = DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    description = DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    if(/script.*?/i.test(description)){
        return res.status(400).json({ error: "Invalid description" });
    }
    if(!["todo","in-progress","done"].includes(status)){
        return res.status(400).json({ error: "Invalid status" });
    }
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: "Invalid date format" });
    }
    if (time && !/^(\d{2}:\d{2}|\d{2}:\d{2}:\d{2})$/.test(time)) {
        return res.status(400).json({ error: "Invalid time format" });
    }

    const tasks = rwDB.readTasks();
    const newTask = {
        id: Date.now(),
        title,
        description,
        status,
        date: date ?? null,
        time: time ?? null
    };
    tasks.push(newTask);
    rwDB.writeTasks(tasks);

    res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    const allTasks = rwDB.readTasks();
    const task = allTasks.find(task => task.id === Number(id));
    if(!task){
        return res.status(404).json({ error: "Task not found" });
    }
    if(!["todo", "in-progress", "done"].includes(status)){
        return res.status(400).json({ error: "Invalid status" });
    }
    task.status = status;
    rwDB.writeTasks(allTasks);
    res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const {id} = req.params;
    const allTasks = rwDB.readTasks();
    const newTasks = allTasks.filter(t => t.id !== Number(id));
    if(allTasks.length === newTasks.length){
        return res.status(404).json({ error: "Task not found" });
    }
    rwDB.writeTasks(newTasks);
    res.status(204).send();
});

module.exports = app;