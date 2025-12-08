import axios from "axios";
import type {Task} from "./Task";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

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
    return res.data.map(d => ({
        ...d,
        date: d.date ? dayjs(d.date, "YYYY-MM-DD") : null,
        time: d.time ? dayjs(d.time, ["HH:mm", "HH:mm:ss"]) : null
    }));
}

//POST api/tasks
export async function createTask(task: Omit<Task, "id">): Promise<Task> {
    //We don't need the id of the task, because we create automatically a new id (Omit)
    const payload = {
        ...task,
        date: task.date ? task.date.format("YYYY-MM-DD") : null,
        time: task.time ? task.time.format("HH:mm") : null,
    };

    const res = await api.post("tasks", payload);

    const d = res.data;
    return {
        ...d,
        date: d.date ? dayjs(d.date) : null,
        time: d.time ? dayjs(d.time, "HH:mm") : null,
    } as Task;
}

//PATCH api/tasks:{id}
export async function updateTaskStatus(id: number, status: Task["status"]): Promise<Task>{
    //We need only the status of the task
    const res = await api.patch(`tasks/${id}`, {status});
    const d = res.data;
    return {
        ...d,
        date: d.date ? dayjs(d.date) : null,
        time: d.time ? dayjs(d.time, "HH:mm") : null,
    } as Task;
}

//DELETE api/tasks:{id}
export async function deleteTask(id: number): Promise<void> {
    //We return nothing, so we don't need a variable
    await api.delete(`tasks/${id}`);
}