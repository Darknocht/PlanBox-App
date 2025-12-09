import {
    ListItem,
    Typography,
    Box,
} from '@mui/material';

interface TextCardProps {
    title: string;
    description: string;
}

export function TextCard({ title, description }: TextCardProps) {
    return (
        <ListItem sx={{ px: 0, mb: 3 }}>
            <Box
                sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
            >

                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        color: 'black',
                        mb: 2,
                        textAlign: 'center'
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{
                        width: '100%',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        textAlign: 'center'
                    }}
                >
                    {description}
                </Typography>
            </Box>
        </ListItem>
    );
};