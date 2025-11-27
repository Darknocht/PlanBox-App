//Test environment
process.env.NODE_ENV = "test";


//Mocking dompurify
jest.mock("dompurify", () => {
    return jest.fn(() => ({
        sanitize: (input) => input.replace(/<script.*?>.*?<\/script>/gi, "")
    }));
});


const request = require("supertest");
const app = require("../src/server");


//Data file, where the tasks are stocked
const DATA_FILE = "test/tasks.test.json"; //   ./src/tasks.json
const readingWritingDatabase = require('../src/readingWritingDatabase');
const test = require("node:test");
const rwDB = new readingWritingDatabase(DATA_FILE);


//Reset the file JSON before each tests
beforeEach(() => {
    rwDB.reset()
});


describe("CORS for Origin links", () => {
    it("CORS should allow requests from localhost:5173", async () => {
        const res = await request(app)
            .get("/tasks")
            .set("Origin", "http://localhost:5173");


        expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
        expect(res.statusCode).toBe(200);
    });

    it("CORS should block requests from unauthorized origins", async () => {
        const res = await request(app)
            .get("/tasks")
            .set("Origin", "http://www.google.com"); //Google is an example but another link can work


        expect(res.headers["access-control-allow-origin"]).toBeUndefined();
        expect(res.statusCode).toBe(403);
        expect(res.text).toMatch(/Not allowed by CORS/);
    });
});


describe("CORS for /api-docs", () => {
    it("should allow GET requests and set CORS headers", async () => {
        const res = await request(app)
            .get("/api-docs/")
            .set("Origin", "http://localhost:3000");


        expect(res.statusCode).toBe(200);
        expect(res.headers["access-control-allow-origin"]).toBe("*");
    });


    it("should respond 200 to OPTIONS preflight requests", async () => {
        const res = await request(app)
            .options("/api-docs/")
            .set("Origin", "http://localhost:3000");


        expect(res.statusCode).toBe(204);
        expect(res.headers["access-control-allow-origin"]).toBe("*");
    });


    it("should call next() for other methods", async () => {
        const res = await request(app)
            .post("/api-docs/")
            .set("Origin", "http://localhost:3000");


        expect(res.headers["access-control-allow-origin"]).toBe("*");
    });


    it("should respond 200 for OPTIONS preflight on /tasks", async () => {
        const res = await request(app)
            .options("/tasks")
            .set("Origin", "http://localhost:5173")
            .set("Access-Control-Request-Method", "POST")


        expect(res.statusCode).toBe(204);
        expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
        expect(res.headers["access-control-allow-methods"]).toBe("GET,POST,PATCH,DELETE,OPTIONS");
        expect(res.headers["access-control-allow-headers"]).toBe("Content-Type");
    });


    it("should respond 200 for OPTIONS preflight on /api-docs/", async () => {
        const res = await request(app)
            .options("/api-docs/")
            .set("Origin", "http://localhost:3000")
            .set("Access-Control-Request-Method", "POST")


        expect(res.statusCode).toBe(204);
        expect(res.headers["access-control-allow-origin"]).toBe("*");
    });
});


describe("Tasks API", () => {
    it("GET should return a void array", async () => {
        const res = await request(app).get("/tasks");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });


    it("GET should return an array with data", async () => {
        await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        await request(app)
            .post("/tasks")
            .send({ title: "New task", description: "I love to make a task.", status: "todo" });
        const res = await request(app)
            .get(`/tasks/`)
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toMatchObject({
            id: res.body[0].id,
            title: "Test",
            description: "",
            status: "todo"
        });
        expect(res.body[1]).toMatchObject({
            id: res.body[1].id,
            title: "New task",
            description: "I love to make a task.",
            status: "todo"
        });
        // Vérification des champs date et time
        res.body.forEach(task => {
            expect(task.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(task.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        });
    });


    it("POST should create a task", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "New task", description: "I love to make a task.", status: "todo" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("New task");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("POST should throw a error with a too long title", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "", description: "I love to make a task.", status: "todo" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid title/);
    });


    it("POST should throw a error with a no title", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "a".repeat(101) });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid title/);
    });


    it("POST should throw a error with a too long description", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "Test", description: "a".repeat(501), status: "todo" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid description/);
    });


    it("POST should throw an error with script in description", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "Test", description: "test test <script> test test test", status: "todo" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid description/);
    });


    it("POST should throw an error with SCRIPT in description", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "Test", description: "test test <SCRIPT> test test test", status: "todo" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid description/);
    });


    it("POST should throw an error with ScRiPt in description", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "Test", description: "test test <ScRiPt> test test test", status: "todo" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid description/);
    });


    it("POST should throw a error with unknown status", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "Test", description: "", status: "test" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid status/);
    });


    it("POST should create a task with status in-progress", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "New task", description: "I love to make a task.", status: "in-progress" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("New task");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("POST should create a task with status done", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({ title: "New task", description: "I love to make a task.", status: "done" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("New task");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("PATCH should update the statut with done", async () => {
        const task = await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        const res = await request(app)
            .patch(`/tasks/${task.body.id}`)
            .send({ status: "done" });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("done");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("PATCH should update the statut with in-progress", async () => {
        const task = await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        const res = await request(app)
            .patch(`/tasks/${task.body.id}`)
            .send({ status: "in-progress" });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("in-progress");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("PATCH should update the statut with todo", async () => {
        const task = await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        const res = await request(app)
            .patch(`/tasks/${task.body.id}`)
            .send({ status: "todo" });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("todo");
        expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });


    it("PATCH should throw a error with an unknown task", async () => {
        const res = await request(app)
            .patch(`/tasks/ab`)
            .send({ status: "done" });
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/Task not found/);
    });


    it("PATCH should throw a error with an unknown status", async () => {
        const task = await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        const res = await request(app)
            .patch(`/tasks/${task.body.id}`)
            .send({ status: "test" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Invalid status/);
    });


    it("DELETE should delete a task", async () => {
        const task = await request(app)
            .post("/tasks")
            .send({ title: "Test" });
        const res = await request(app).delete(`/tasks/${task.body.id}`);
        expect(res.statusCode).toBe(204);
    });


    it("DELETE should throw a error with an unknown task", async () => {
        const res = await request(app).delete(`/tasks/ab`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/Task not found/);
    });
});
