import React, { useState, useMemo, useEffect } from 'react';
import { Box, Tabs, Tab, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs, { Dayjs } from 'dayjs';
import type { Task } from '../Task';
import { getTasks } from '../api'; // adapte le chemin si besoin
import { TaskCard } from '../components/TaskCard'; // fichier que l’on crée plus bas

export function Calendar() {
    const [tab, setTab] = useState<'day' | 'week' | 'month'>('day');
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks().then(setTasks).catch(console.error);
    }, []);

    const handlePrev = () => {
        setCurrentDate(d => d.subtract(1, 'day'));
    };

    const handleNext = () => {
        setCurrentDate(d => d.add(1, 'day'));
    };

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: 'day' | 'week' | 'month'
    ) => {
        setTab(newValue);
    };

    const filteredTasks = useMemo(
        () => tasks.filter(t => t.date && t.date.isSame(currentDate, 'day')),
        [tasks, currentDate]
    );

    return (
        <Box sx={{ p: 2, pb: 10 }}>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                centered
                textColor="inherit"
                indicatorColor="primary"
            >
                <Tab label="Day" value="day" />
                <Tab label="Week" value="week" />
                <Tab label="Month" value="month" />
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton onClick={handlePrev}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h6">
                        {currentDate.format('ddd, MMM D YYYY')}
                    </Typography>
                </Box>

                <IconButton onClick={handleNext}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Box sx={{ mt: 2 }}>
                {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </Box>
        </Box>
    );
}
