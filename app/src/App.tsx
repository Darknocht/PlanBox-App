import {useEffect, useState} from 'react'
import TaskForm from "./components/TaskForm.tsx";
import TaskList from "./components/TaskList.tsx";
import './App.css'
import BottomNav from "./components/BottomNav.tsx";

function App() {
    const [reload, setReload] = useState<boolean>(false);

    //Change the title of Web-Application
    useEffect(() => {
        document.title = "PlanBox";
    }, []);

  return (
    <>
        <TaskForm onTaskCreated={() => setReload(!reload)} />
        <TaskList reload={reload} />
        <BottomNav/>
    </>
  )
}

export default App
