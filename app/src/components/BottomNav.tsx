import * as React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function BottomNav() {
    const [value, setValue] = React.useState(0);

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
            }}
            elevation={3}
        >
            <BottomNavigation
                value={value}
                sx={{
                    bgcolor: '#7fd3f9',            // bleu clair
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.primary',
                    },
                    '& .Mui-selected': {
                        color: 'primary.dark',
                    },
                }}
                onChange={(event, newValue) => setValue(newValue)}
                showLabels
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Calendar" icon={<CalendarTodayIcon />} />
                <BottomNavigationAction label="About" icon={<MoreHorizIcon />} />
            </BottomNavigation>
        </Paper>
    );
}
