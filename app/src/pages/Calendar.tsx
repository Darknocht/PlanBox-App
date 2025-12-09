import React, { useState, useMemo, useEffect } from 'react';
import { Box, Tabs, Tab, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs, { Dayjs } from 'dayjs';
import type { Task } from '../Task';
import { getTasks } from '../api';
import { TaskCard } from '../components/TaskCard';

export function Calendar() {
    const [tab, setTab] = useState<'day' | 'week' | 'month'>('day');
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks().then(setTasks).catch(console.error);
    }, []);

    const handleTaskDeleted = (idDeleted: number) => {
        setTasks((prevTasks) => prevTasks.filter(t => t.id !== idDeleted));
    };

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
        );
    };

    const handlePrev = () => setCurrentDate(d => d.subtract(1, tab));
    const handleNext = () => setCurrentDate(d => d.add(1, tab));

    const handleTabChange = (_event: React.SyntheticEvent, newValue: 'day' | 'week' | 'month') => {
        setTab(newValue);
    };

    const filteredTasks = useMemo(
        () => tasks.filter(t => t.date && t.date.isSame(currentDate, tab)),
        [tasks, currentDate, tab]
    );

    const renderDateLabel = () => {
        if (tab === 'day') return currentDate.format('ddd, MMM D YYYY');
        if (tab === 'week') {
            return `${currentDate.startOf('week').format('MMM D')} - ${currentDate.endOf('week').format('MMM D YYYY')}`;
        }
        return currentDate.format('MMMM YYYY');
    };

    return (
        // 1. MODIFICATION : J'ai retiré le 'p: 2' ici pour que le header touche les bords
        <Box sx={{ pb: 10 }}>

            {/* HEADER BLEU */}
            <Box sx={{
                bgcolor: '#4fc3f7',
                color: 'white',
                pt: 1,
                width: '100%' // S'assure de prendre toute la largeur
            }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    // 2. MODIFICATION : 'fullWidth' étend les onglets sur toute la largeur
                    variant="fullWidth"
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        minHeight: 48,
                        '& .MuiTab-root': {
                            color: 'rgba(0, 0, 0, 0.5)',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                        },
                        '& .Mui-selected': {
                            color: '#ffffff !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ffffff',
                            height: 4,
                            borderRadius: '2px 2px 0 0' // Petit arrondi sur l'indicateur
                        },
                    }}
                >
                    <Tab label="Day" value="day" />
                    <Tab label="Week" value="week" />
                    <Tab label="Month" value="month" />
                </Tabs>
            </Box>

            {/* CONTENU (Avec Padding ajouté ici du coup) */}
            <Box sx={{ px: 2 }}>

                {/* Navigation Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'center', color: 'black' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {renderDateLabel()}
                        </Typography>
                    </Box>
                    <IconButton onClick={handlePrev}><ArrowBackIosNewIcon /></IconButton>
                    <IconButton onClick={handleNext}><ArrowForwardIosIcon /></IconButton>
                </Box>

                {/* Liste des tâches */}
                <Box sx={{ mt: 2 }}>
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onTaskDeleted={handleTaskDeleted}
                            onTaskUpdated={handleTaskUpdated}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}