const fs = require("fs");

class readingWritingDatabase {

    #DATA_FILE; //Private element
    constructor(DATA_FILE) {
        this.#DATA_FILE = DATA_FILE;
    }

    /**
     * Read a task in DATA_FILE with his different components (title, description, status)
     * @returns {any|*[]}
     */
    readTasks() {
        //Data_FILE does not exist
        if (!fs.existsSync(this.#DATA_FILE)){
            throw new Error(`File not found: ${this.#DATA_FILE}`);
        }
        else{
            return JSON.parse(fs.readFileSync(this.#DATA_FILE));
        }
    }

    /**
     * Write a new task in the file DATA_FILE
     * @param {Object} tasks with his different components (title, description, status)
     * @returns {any|*[]}
     */
    writeTasks(tasks) {
        fs.writeFileSync(this.#DATA_FILE, JSON.stringify(tasks, null, 2));
    }

    /**
     * reset the DATA_FILE and initialise with an array
     * @returns {any|*[]}
     */
    reset(){
        fs.writeFileSync(this.#DATA_FILE, "[]");
    }
}

module.exports = readingWritingDatabase;