import axios from "axios";
import type {Task} from "./Task";

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    //Our API is located on port 3000 locally or on the Render server
})

//GET api/tasks
export async function getTasks(): Promise<Task[]> {
    //The api is located in the folder /api/
    const res = await api.get<Task[]>("tasks");
    return res.data;
}

//POST api/tasks
export async function createTask(task: Omit<Task, "id">): Promise<Task> {
    //We don't need the id of the task, because we create automatically a new id (Omit)
    const res = await api.post("tasks", task);
    return res.data;
}

//PATCH api/tasks:{id}
export async function updateTaskStatus(id: number, status: Task["status"]): Promise<Task>{
    //We need only the status of the task
    const res = await api.patch(`tasks/${id}`, {status});
    return res.data;
}

//DELETE api/tasks:{id}
export async function deleteTask(id: number): Promise<void> {
    //We return nothing, so we don't need a variable
    await api.delete(`tasks/${id}`);
}