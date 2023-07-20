import {  Box, Alert, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function() {
    return (
        <>
            <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold" }}>Yahoo Japan</Box>
            <Box sx={{
                width: 480,
                my: 1,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
            }}>
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    size="small"
                />
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    size="small"
                    sx={{
                        mt: 1,
                    }}
                />
                <Alert severity="error" sx={{ mt: 1 }}>Please log in</Alert>
                <LoadingButton variant="outlined" sx={{ my: 1, mx: "auto", width: 160 }}>Login</LoadingButton>
            </Box>
            <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold" }}>Google</Box>
            <Box sx={{
                width: 480,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
            }}>
                <Alert severity="error" sx={{ mt: 1 }}>Please log in</Alert>
                <LoadingButton variant="outlined" sx={{ my: 1, mx: "auto", width: 160 }}>Login</LoadingButton>
            </Box>
        </>
    );
}