import {useState} from "react";
import TaskForm from "../components/TaskForm.tsx";
import TaskList from "../components/TaskList.tsx";
import {WelcomeScreen} from "../components/WelcomeScreen.tsx";

export function List() {
    const [reload, setReload] = useState<boolean>(false);

    return (
        <>
            <TaskForm onTaskCreated={() => setReload(!reload)} />
            <TaskList reload={reload} />
            <WelcomeScreen/>
        </>
    );
}