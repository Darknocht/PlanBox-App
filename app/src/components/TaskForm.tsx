import React, {useEffect, useState} from 'react';
import {TextField, Button, MenuItem, Paper, Dialog, DialogTitle, DialogContent, Box, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import {createTask} from "../api.ts";
import type {Task} from "../Task.ts";
import DOMPurify from "dompurify";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

//Interface Props for the main function
interface Props {
    onTaskCreated: () => void;
}

export default function TaskForm({onTaskCreated}: Props){
    //Initialisation of each State of a task with error
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<Task["status"]>("todo");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
    const [time, setTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
    const [error, setError] = useState<string[]>(["",""]);

    //Initialisation of a pop-up TaskForm
    const [open, setOpen] = useState<boolean>(false);

    /**
     * Checking if title and description don't meet the criteria
     * @param t {string} title of the form to test
     * @param d {string} description of the form to test
     * @param date {Dayjs | null} date of the form to test
     * @param time {Dayjs | null} time of the form to test
     * @return {string[]} an Array of description errors (empty if there are no error)
     */
    const checking = (t: string, d:string, date: Dayjs | null,
                      time: Dayjs | null): string[] => {
        let errors: string[] = ["", "", "", ""];
        if(!t || t.length > 100){
            errors[0] = "Mandatory title with max 100 characters";
        }
        if(d.length > 500 || /<script>/i.test(d)){
            errors[1] = "Description max 500 characters and no JS-Code"
        }
        if (!date || !date.isValid()) {
            errors[2] = "Invalid date";
        }
        if (!time || !time.isValid()) {
            errors[3] = "Invalid time";
        }
        return errors;
    }

    //Update title and description if changing in form
    useEffect(() => {
        setError(checking(title, description, date, time));
    }, [title, description, date, time]);

    /**
     * Create the task when the creating Button is clicked and close the window
     * @param e event when the creating Button is clicked
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //An error has been found
        if(error[0].length > 0 || error[1].length > 0 || error[2].length > 0 || error[3].length > 0){
            return;
        }

        //Sanitization of title and description
        const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        const sanitizedDescription = DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

        //Initialisation of the task
        await createTask({title: sanitizedTitle, description: sanitizedDescription, status, date: date, time: time});

        //Reset of the inputs
        setTitle("");
        setDescription("");
        setStatus("todo");
        setDate(null);
        setTime(null);
        setError(["",""]);
        onTaskCreated();

        //We close the window, the task has been created
        setOpen(false);
    };

    //Representation of a TaskForm to create a new task
    return (
        <Paper sx={{p:2, mb:2, borderRadius: 2}}>
            {/*Title and create button*/}
            <Typography variant="h3" color="black" sx={{mb: 2}}>PlanBox App</Typography>
            {/*When the create button is clicked, a pop-up shows up*/}
            <Button
                variant="contained"
                color="success"
                onClick={() => setOpen(true)}
                startIcon={<AddCircleOutlineIcon/>}
            >
                create a task
            </Button>

            {/*Window of the pop-up */}
            <Dialog
                open={open}
                onClose={() => {setOpen(false)}}
            >
                <DialogTitle>
                    Create a task
                    {/*Button to close the window */}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setOpen(false)}
                        startIcon={<CloseIcon/>}
                        sx={{float: "right"}}>
                        Close
                    </Button>
                </DialogTitle>
                <DialogContent>
                    {/*Form to create a new task */}
                    <form onSubmit={handleSubmit}>
                        {/*Input for the title */}
                        <TextField
                            fullWidth={true}
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={Boolean(!!error && error[0].length > 0)}
                            helperText={error[0] || " "}
                            sx={{mt: 2,
                                "& .MuiFormHelperText-root": {
                                    minHeight: "20px",
                                    minWidth: "300px",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                    maxWidth: "100%"
                                }}}
                        />
                        {/*Input for description */}
                        <TextField
                            fullWidth={true}
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline={true}
                            rows={3}
                            sx={{mt:2,
                                "& .MuiFormHelperText-root": {
                                    minHeight: "20px",
                                    minWidth: "200px",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                    maxWidth: "100%"
                                }}}
                            error={Boolean(!!error && error[1].length > 0)}
                            helperText={error[1] || " "}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                                sx={{mt:2,
                                    "& .MuiFormHelperText-root": {
                                        minHeight: "20px",
                                        minWidth: "200px",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        overflowWrap: "anywhere",
                                        maxWidth: "100%"
                                    }}}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Time"
                                value={time}
                                onChange={(newValue) => setTime(newValue)}
                                sx={{mt:2,
                                    "& .MuiFormHelperText-root": {
                                        minHeight: "20px",
                                        minWidth: "200px",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        overflowWrap: "anywhere",
                                        maxWidth: "100%"
                                    }}}
                            />
                        </LocalizationProvider>
                        {/*Select button to choose a status*/}
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <TextField
                                size="small"
                                select={true}
                                multiline={true}
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Task["status"])}
                                sx={{
                                    mt: 2,
                                    ml: 2
                                }}
                            >
                                <MenuItem value="todo">To do</MenuItem>
                                <MenuItem value="in-progress">In progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </TextField>
                            {/*Submit button to create the new task*/}
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={Boolean(error[0] || error[1] || error[2] || error[3])}
                                startIcon={<AddCircleOutlineIcon/>}
                                sx={{
                                    mt: 2,
                                    ml: 2
                                }}
                            >
                                create
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </Paper>
    );
}