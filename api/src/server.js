const express = require("express"); //Database server
const cors = require("cors"); //CORS Security for the paths


//Data file, where the tasks are stocked
const readingWritingDatabase = require('./readingWritingDatabase');


const fs = require("fs");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");
const apiDocsFile = fs.readFileSync("./src/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(apiDocsFile);


//Initiation instance for the sanitization of inputs (Title and Description)
let DOMPurify;


/* istanbul ignore next */
try {
    //In test environments
    if(process.env.NODE_ENV === "test") {
        console.warn("DOMPurify initialization skipped (test environment).");
        DOMPurify = {
            sanitize: (x) => x.replace(/<script.*?>.*?<\/script>/gi, ""), // safe fallback
        };
    }
    else{
        //In normal environments, use jsdom + dompurify
        const { JSDOM } = require("jsdom");
        const createDOMPurify = require("dompurify");
        const window = new JSDOM("").window;
        DOMPurify = createDOMPurify(window);
    }
}
catch(e){
    //Fallback safety net
    console.warn("DOMPurify initialization failed, using fallback sanitizer.", e);
    DOMPurify = {
        sanitize: (x) => x.replace(/<script.*?>.*?<\/script>/gi, ""),
    };
}


const app = express();


//Using a security with CORS, to allow only front-end to the port 5173
const allowedOrigins = [
    "http://localhost:5173", //Front-End local server
    "http://localhost:3000", //Back-End local server
];


//Swagger route
app.use("/api-docs/", cors(), swaggerUi.serve, swaggerUi.setup(swaggerDocument));



//CORS middleware for API routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        cors({
            origin: function(o, callback) { callback(null, true); },
            methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
            allowedHeaders: ["Content-Type"]
        })(req, res, next);
    }
    else {
        res.status(403).send("Not allowed by CORS");
    }
});


//Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});


app.use(express.json());


//We want just 2 files for our Programm, tasks.json for the App and tasks.test.json for tests
/* istanbul ignore next */
const rwDB = new readingWritingDatabase(
    process.env.NODE_ENV === "test" ? "test/tasks.test.json" : "src/tasks.json"
);


//Different commands for a task


//GET /tasks
app.get('/tasks', (req, res) => {
    //Sanitization of title and description in tasks before to send
    const tasks = rwDB.readTasks().map(task => ({
        ...task,
        title: DOMPurify.sanitize(task.title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        description: DOMPurify.sanitize(task.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    }));
    res.status(200).json(tasks); //Code 200 (OK)
});


//POST /tasks
app.post('/tasks', (req, res) => {
    let {title, description="", status = "todo" } = req.body;


    //Checking arguments
    //title must not empty and max 100 characters
    if(title.length <= 0 || title.length > 100){
        return res.status(400).json({ error: "Invalid title" });
    }
    //description must max 500 characters
    if(description.length > 500){
        //<script> can be <SCRIPT>, <ScRiPt>, etc.
        return res.status(400).json({ error: "Invalid description" });
    }


    //Sanitization of title and description
    title = DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    description = DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });


    //description must not contain <script>
    if(/script.*?/i.test(description)){
        //<script> can be <SCRIPT>, <ScRiPt>, etc.
        return res.status(400).json({ error: "Invalid description" });
    }
    //status must contain todo, in-progress or done
    if(!["todo","in-progress","done"].includes(status)){
        //We can use includes because we have only 3 values
        return res.status(400).json({ error: "Invalid status" });
    }


    //After Checking, the task will be added
    const tasks = rwDB.readTasks();
    const now = new Date();
    const newTask = {
        id: Date.now(),
        title,
        description,
        status,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().split(" ")[0]
    };
    tasks.push(newTask);
    rwDB.writeTasks(tasks);


    //Code 201 = new created task without problem
    res.status(201).json(newTask);
});


//PATCH /tasks:id
app.patch('/tasks/:id', (req, res) => {
    //Given task
    const {id} = req.params;
    const {status} = req.body;


    //All tasks stocks
    const allTasks = rwDB.readTasks();


    //Checking if we find the task in allTasks
    const task = allTasks.find(task => task.id === Number(id));
    if(!task){
        return res.status(404).json({ error: "Task not found" });
    }


    //Checking if the status is between the 3 values
    if(!["todo", "in-progress", "done"].includes(status)){
        return res.status(400).json({ error: "Invalid status" });
    }


    //Update status of task in DATA_FILE
    task.status = status;
    rwDB.writeTasks(allTasks);
    res.status(200).json(task); //Code 200 (OK)
});


app.delete('/tasks/:id', (req, res) => {
    //id for the deleted task
    const {id} = req.params;


    //All tasks stocks
    const allTasks = rwDB.readTasks();


    //We copy the all tasks in newTasks except the deleted task
    const newTasks = allTasks.filter(t => t.id !== Number(id));


    //If the length of both are equals, the task wasn't deleted
    if(allTasks.length === newTasks.length){
        return res.status(404).json({ error: "Task not found" });
    }


    //Update the tasks in DATA_FILE
    rwDB.writeTasks(newTasks);
    res.status(204).send(); //Code 204 (OK, but no additional content)
});


module.exports = app;
