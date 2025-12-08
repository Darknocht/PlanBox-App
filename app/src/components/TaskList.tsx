import { useEffect, useState } from "react";
import { List } from "@mui/material";
import type { Task } from "../Task";
import { getTasks } from "../api";
import { TaskCard } from "../components/TaskCard";

interface Props {
    reload: boolean;
}

export default function TaskList({ reload }: Props) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks().then(setTasks);
    }, [reload]);

    const handleTaskDeleted = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleTaskUpdated = (updated: Task) => {
        setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    };

    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                mt: 0,
                mb: 0,
                ml: "auto",
                mr: "auto",
            }}
        >
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onTaskDeleted={handleTaskDeleted}
                    onTaskUpdated={handleTaskUpdated}
                />
            ))}
        </List>
    );
}
