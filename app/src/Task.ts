export interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done"; //a Task has a status between this 3 String values
}