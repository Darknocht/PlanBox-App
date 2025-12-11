import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
        >
            <BottomNavigation
                value={path}
                sx={{
                    bgcolor: '#7fd3f9',
                    '& .MuiBottomNavigationAction-root': { color: '#433f58' },
                    '& .Mui-selected': { color: 'primary.dark' },
                }}
                showLabels
            >
                <BottomNavigationAction
                    label="List"
                    value="/"
                    icon={<ListIcon />}
                    component={Link}
                    to="/"
                />
                <BottomNavigationAction
                    label="Calendar"
                    value="/calendar"
                    icon={<CalendarTodayIcon />}
                    component={Link}
                    to="/calendar"
                />
                <BottomNavigationAction
                    label="About"
                    value="/about"
                    icon={<MoreHorizIcon />}
                    component={Link}
                    to="/about"
                />
            </BottomNavigation>
        </Paper>
    );
}
