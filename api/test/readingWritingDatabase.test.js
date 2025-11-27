const readingWritingDatabase = require('../src/readingWritingDatabase');

describe("readingWritingDatabase()", () => {
    it('rwDB should reset', () => {
        const rwDB = new readingWritingDatabase("test/tasks.test.json");
        rwDB.reset();
        expect(rwDB.readTasks()).toEqual([]);
    });

    it('rwDB should read', () => {
        const rwDB = new readingWritingDatabase("test/tasks.test.json");
        expect(rwDB.readTasks()).toEqual([]);
    });

    it('rwDB should write', () => {
        const rwDB = new readingWritingDatabase("test/tasks.test.json");
        const allTasks = rwDB.readTasks();
        const task = { title: "New task", description: "I love to make a task.", status: "todo" };
        allTasks.push(task);
        rwDB.writeTasks(allTasks);
        expect(rwDB.readTasks()).toEqual([{ title: "New task", description: "I love to make a task.", status: "todo" }]);
        rwDB.reset();
    });

    it('rwDB should throw an error in reading', () => {
        const rwDB = new readingWritingDatabase("unknown.json");
        expect(() => rwDB.readTasks()).toThrow("File not found: unknown.json");
    })
})