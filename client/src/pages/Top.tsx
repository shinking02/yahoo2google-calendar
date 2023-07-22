import {  Box, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { post } from "../lib/api";

export default function() {
    const [fromDate, setFromDate] = React.useState<dayjs.Dayjs | null>(dayjs().subtract(1, "month"));
    const [toDate, setToDate] = React.useState<dayjs.Dayjs | null>(dayjs());
    const [collectDate, setCollectDate] = React.useState<boolean>(false);
    const [isLogin, setIsLogin] = React.useState<boolean>(false);
    const [importing, setImporting] = React.useState<boolean>(false);
    useEffect(() => {
        const existAccessToken = document.cookie.includes("access_token");
        setIsLogin(existAccessToken);
        checkDate();
    },[]);
    useEffect(() => {checkDate()}, [fromDate, toDate]);
    const checkDate = () => {
        console.log(fromDate?.format("YYYYMMDD"))
        console.log(toDate?.format("YYYYMMDD"))
        if(toDate && fromDate && toDate.isAfter(fromDate)) {
            setCollectDate(true);
        } else {
            setCollectDate(false);
        }
    };
    const importHandler = async() => {
        setImporting(true);
        const calData = await post("/importCal", { from: fromDate, to: toDate });
        localStorage.setItem("yahoo-calendar-data", calData);
        setImporting(false);
    }
    return (
        <>
            <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold" }}>Googleログイン</Box>
            <Box sx={{
                width: 480,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
            }}>
                <Alert
                    severity={isLogin ? "success" : "error"}
                    sx={{ mt: 1 }}
                >
                    {isLogin ? "ログイン済みです!" : " ログインしてください"}
                </Alert> 
                <LoadingButton variant="outlined" href="/auth" sx={{ my: 1, mx: "auto", width: 160 }}>ログイン</LoadingButton>
            </Box>
            <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold" }}>期間</Box>
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
                            value={fromDate}
                            disableFuture
                            onChange={(v) => {setFromDate(v)}}
                        />
                        <DesktopDatePicker
                            label="To" 
                            value={toDate}
                            disableFuture
                            onChange={(v) => {setToDate(v)}}
                        />
                    </LocalizationProvider>
                </Box>
                {!collectDate && 
                    <Alert severity="error" sx={{ mt: 1 }}>期間が不正です</Alert>                
                }
                <LoadingButton
                    variant="outlined"
                    sx={{ my: 1, mx: "auto", width: 160 }}
                    disabled={!collectDate || !isLogin}
                    loading={importing}
                    onClick={importHandler}
                >
                    インポート
                </LoadingButton>
            </Box>
        </>
    );
}