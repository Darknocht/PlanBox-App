import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SkipNextIcon from '@mui/icons-material/SkipNext';

// Define the steps for the welcome screen
const steps = [
    {
        title: "Welcome to PlanBox!",
        content: "PlanBox is your simple and effective task management app. This quick tour will show you the essentials.",
    },
    {
        title: "Step 1: Managing Your Tasks",
        content: (
            <>
                <Typography variant="body1" gutterBottom>
                    You can add new tasks and control their status:
                </Typography>
                <ul>
                    <li>
                        **Add Tasks:** Use the "+" button (often in the Home view) to quickly create new tasks.
                    </li>
                    <li>
                        **Track Status:** Each task starts as **"todo"**. You can change its status to **"in-progress"** or **"done"** to keep track of your progress.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: "Step 2: Stay Organized with Dates",
        content: (
            <>
                <Typography variant="body1" gutterBottom>
                    To keep track of deadlines and schedule your day:
                </Typography>
                <ul>
                    <li>
                        **Organize:** Tasks can be assigned a **date** and **time** to help you organize your schedule.
                    </li>
                    <li>
                        **Calendar View:** Switch to the **Calendar** tab to see your scheduled tasks in a monthly overview.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: "You're All Set!",
        content: (
            <>
                <Typography variant="body1" gutterBottom>
                    That's everything you need to know to get started with PlanBox.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                    You can always click the **Info** button later to review these instructions.
                </Typography>
            </>
        ),
    },
];

// Key for localStorage to track if the initial welcome screen has been shown
const WELCOME_SCREEN_KEY = 'planbox_welcome_shown';

export function WelcomeScreen(){
    // State to manage modal visibility
    const [open, setOpen] = useState<boolean>(false);
    // State to manage the current step in the walkthrough
    const [currentStep, setCurrentStep] = useState(0);

    // Effect to check local storage and automatically open the modal on first visit
    useEffect(() => {
        const welcomeShown = localStorage.getItem(WELCOME_SCREEN_KEY);
        if (!welcomeShown) {
            setOpen(true);
            setCurrentStep(0); // Ensure it starts from the beginning
        }
    }, []);

    // Function to close the modal and mark it as shown
    const handleSkipOrStart = () => {
        setOpen(false);
        localStorage.setItem(WELCOME_SCREEN_KEY, 'true');
    };

    // Function to move to the next step
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // If it's the last step, treat "Next" as "Let's Get Started"
            handleSkipOrStart();
        }
    };

    // Determine button labels based on the current step
    const isLastStep = currentStep === steps.length - 1;
    const nextButtonText = isLastStep ? "Let's Get Started!" : "Next";
    const nextButtonIcon = isLastStep ? <CheckCircleOutlineIcon/> : <ArrowForwardIcon/>;

    // Reset step when opening manually
    const handleOpenInfo = () => {
        setOpen(true);
        setCurrentStep(0);
    }

    return (
        <>
            {/* Info Button for manual review */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenInfo}
                startIcon={<InfoIcon/>}
                sx={{
                    position: 'fixed',
                    bottom: 125,
                    right: 16,
                    zIndex: 1000,
                    textTransform: 'none',
                    borderRadius: 8,
                    boxShadow: 3
                }}
            >
                Info
            </Button>

            {/* The multi-step Dialog/Modal */}
            <Dialog
                open={open}
                onClose={() => {
                    // Prevent closing via backdrop/escape on initial load
                    const welcomeShown = localStorage.getItem(WELCOME_SCREEN_KEY);
                    if (welcomeShown) {
                        setOpen(false)
                    }
                }}
                aria-labelledby="welcome-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="welcome-dialog-title">
                    {steps[currentStep].title}
                </DialogTitle>

                <DialogContent dividers>
                    {steps[currentStep].content}

                    {/* Step indicator */}
                    <Typography variant="caption" display="block" align="center" sx={{ mt: 3 }}>
                        Step {currentStep + 1} of {steps.length}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    {/* Skip Button (only visible before the last step and only if it's the initial showing) */}
                    {!isLastStep && !localStorage.getItem(WELCOME_SCREEN_KEY) && (
                        <Button
                            onClick={handleSkipOrStart}
                            color="inherit"
                            startIcon={<SkipNextIcon/>}
                            sx={{ textTransform: 'none', borderRadius: 8 }}
                        >
                            Skip Tour
                        </Button>
                    )}

                    {/* Placeholder for left-aligned content / making next button float right */}
                    <div style={{ flexGrow: 1 }} />

                    {/* Next Button / Let's Get Started Button */}
                    <Button
                        onClick={handleNext}
                        color={isLastStep ? "success" : "primary"}
                        variant="contained"
                        endIcon={nextButtonIcon}
                        sx={{ textTransform: 'none', borderRadius: 8, boxShadow: 3 }}
                    >
                        {nextButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};