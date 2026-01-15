import React, { useState } from 'react';
import {
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Button,
    MenuItem,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import type { Task } from '../Task';
import { deleteTask, updateTaskStatus } from '../api';

interface Props {
    task: Task;
    onTaskDeleted?: (id: number) => void;
    onTaskUpdated?: (task: Task) => void;
}

const colorTask = (status: string) => {
    if (status === 'todo') return 'error.light';
    if (status === 'in-progress') return 'warning.light';
    return 'success.light';
};

export const TaskCard: React.FC<Props> = ({ task, onTaskDeleted, onTaskUpdated }) => {
    // State to manage the visibility of the delete confirmation popup
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Open the confirmation dialog
    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    // Close the confirmation dialog
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    // Final execution of the deletion after user confirmation
    const handleDelete = async () => {
        await deleteTask(task.id);
        onTaskDeleted?.(task.id);
        handleCloseDeleteDialog();
    };

    const handleStatusChange = async (status: Task['status']) => {
        const updated = await updateTaskStatus(task.id, status);
        onTaskUpdated?.(updated);
    };

    return (
        <ListItem alignItems="flex-start" sx={{ px: 0, mb: 1 }}>
            <ListItemText
                style={{ backgroundColor: 'white', borderRadius: 10, border: '1px solid #D9D9D9' }}
                secondary={
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 1,
                                    display: 'inline-block',
                                    ml: 1,
                                    mr: 1,
                                    mt: 1,
                                    flexShrink: 0,
                                    bgcolor: colorTask(task.status),
                                }}
                            />
                            <Typography
                                component="span"
                                variant="h5"
                                sx={{
                                    color: 'text.primary',
                                    mr: 4.75,
                                    display: 'inline',
                                    wordBreak: 'break-word',
                                    maxWidth: '100%',
                                    textAlign: 'left',
                                }}
                            >
                                {task.title}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                                ml: 4.75,
                                mr: 4.75,
                                wordBreak: 'break-word',
                                maxWidth: '100%',
                            }}
                        >
                            {task.description}
                        </Typography>

                        <TextField
                            size="small"
                            select
                            label="Status"
                            value={task.status}
                            onChange={(e) =>
                                handleStatusChange(e.target.value as Task['status'])
                            }
                            sx={{ mt: 2, ml: 2, mb: 1, minWidth: 125 }}
                        >
                            <MenuItem value="todo">To do</MenuItem>
                            <MenuItem value="in-progress">In progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                        </TextField>

                        {/* Trigger button for the confirmation popup */}
                        <Button
                            onClick={handleOpenDeleteDialog}
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            sx={{
                                mt: 2,
                                float: 'right',
                                mr: 2,
                                textTransform: 'none',
                                borderRadius: 8,
                                boxShadow: 3,
                            }}
                        >
                            Delete
                        </Button>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                                ml: 1.75,
                                mr: 4.75,
                                fontWeight: 'bold',
                                wordBreak: 'break-word',
                                maxWidth: '100%',
                            }}
                        >
                            {task.time ? task.time.format('hh:mm A') : ''}
                            {task.date ? '  ' + task.date.format('DD/MM/YYYY') : ''}
                        </Typography>

                        {/* Confirmation Dialog Component */}
                        <Dialog
                            open={isDeleteDialogOpen}
                            onClose={handleCloseDeleteDialog}
                            aria-labelledby="delete-dialog-title"
                            aria-describedby="delete-dialog-description"
                        >
                            <DialogTitle id="delete-dialog-title">
                                {"Confirm Deletion"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="delete-dialog-description">
                                    Are you sure you want to delete the task <strong>"{task.title}"</strong>?
                                    This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ pb: 2, px: 3 }}>
                                <Button onClick={handleCloseDeleteDialog}
                                        color="inherit"
                                        variant="contained"
                                        startIcon={<CloseIcon />}
                                        sx={{
                                            mt: 2,
                                            float: 'right',
                                            mr: 2,
                                            textTransform: 'none',
                                            borderRadius: 8,
                                            boxShadow: 3,
                                        }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                        mt: 2,
                                        float: 'right',
                                        mr: 2,
                                        textTransform: 'none',
                                        borderRadius: 8,
                                        boxShadow: 3,
                                    }}
                                    autoFocus
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Divider component="li" />
                    </>
                }
            />
        </ListItem>
    );
};