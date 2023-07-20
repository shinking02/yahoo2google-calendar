import {  Box, Alert } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LoadingButton } from "@mui/lab";
import dayjs from 'dayjs'

export default function() {
    return (
        <>
            <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold" }}>Import</Box>
            <Box sx={{
                width: 480,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 480,
                    mx: "auto",
                    mt: 2
                }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="From" 
                        />
                        <DesktopDatePicker
                            label="To" 
                        />
                    </LocalizationProvider>
                </Box>
                <LoadingButton variant="outlined" sx={{ my: 1, mx: "auto", width: 160 }}>Inport</LoadingButton>
                <Alert severity="error" sx={{ mt: 1 }}>Invalid date</Alert>
            </Box>
        </>
    );
}