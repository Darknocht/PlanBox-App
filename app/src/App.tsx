import {useEffect} from 'react'
import './App.css'
import BottomNav from "./components/BottomNav.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home.tsx"
import {About} from "./pages/About.tsx";

function App() {

    //Change the title of Web-Application
    useEffect(() => {
        document.title = "PlanBox";
    }, []);

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<About/>} />
                <Route path="/about" element={<About />} />
            </Routes>

            <BottomNav />
        </BrowserRouter>
    </>
  )
}

export default App
