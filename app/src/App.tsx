import { useEffect } from 'react';
import './App.css';
import BottomNav from "./components/BottomNav.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { List } from "./pages/List.tsx";
import { About } from "./pages/About.tsx";
import { Calendar } from "./pages/Calendar.tsx";
import {Box} from "@mui/material";
import Clarity from '@microsoft/clarity';

const projectId = "urha54l92k"

Clarity.init(projectId);

function App() {
    useEffect(() => {
        document.title = "PlanBox";
    }, []);

    return (
        <>
            <Box
                component="img"
                sx={{
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                }}
                alt="Logo of PlanBox"
                src="src/assets/planbox.png"
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<List />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/about" element={<About />} />
                </Routes>

                <BottomNav />
            </BrowserRouter>
        </>
    );
}

export default App;