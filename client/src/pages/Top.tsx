import {  Box, Alert, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { post } from "../lib/api";
import * as apiType from "../../../types/apiTypes"

export default function() {
    const [fromDate, setFromDate] = React.useState<dayjs.Dayjs | null>(dayjs().subtract(1, "month"));
    const [toDate, setToDate] = React.useState<dayjs.Dayjs | null>(dayjs());
    const [collectDate, setCollectDate] = React.useState<boolean>(false);
    const [isLogin, setIsLogin] = React.useState<boolean>(false);
    const [importing, setImporting] = React.useState<boolean>(false);
    const [calResponse, setCalResponse] = React.useState<apiType.ImportCalResponse | null>(null);
    const [selectedCalendars, setSelectedCarendars] = React.useState<string[]>([]);
    useEffect(() => {
        const existAccessToken = document.cookie.includes("access_token");
        setIsLogin(existAccessToken);
        checkDate();
    },[]);
    useEffect(() => {checkDate()}, [fromDate, toDate]);
    const checkDate = () => {
        if(toDate && fromDate && toDate.isAfter(fromDate)) {
            setCollectDate(true);
        } else {
            setCollectDate(false);
        }
    };
    const importHandler = async() => {
        setImporting(true);
        const response = await post("/importCal", { from: fromDate, to: toDate }) as apiType.ImportCalResponse;
        setCalResponse(response);
        console.log(response);
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
                            onChange={(v) => {setFromDate(v)}}
                        />
                        <DesktopDatePicker
                            label="To" 
                            value={toDate}
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
                {calResponse?.error && 
                    <Alert severity="error" sx={{ mt: 1 }}>{calResponse.error}</Alert>                
                }
                {calResponse && !calResponse.error &&
                    <Alert severity="success" sx={{ mt: 1 }}>インポート成功！</Alert>
                }
            </Box>
            {calResponse && calResponse.events && calResponse.events.length > 0 &&
                <>
                    <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold", mt: 2}}>エクスポート</Box>
                    <Box sx={{
                        width: 380,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <FormGroup>
                            {calResponse.calList.map(cal => {
                                return (
                                    <FormControlLabel
                                        key={cal.name}
                                        control={
                                            <Checkbox
                                                checked={selectedCalendars.includes(cal.name)}
                                                onChange={() => {
                                                    const newSelectedCalendars = selectedCalendars.includes(cal.name)
                                                        ? selectedCalendars.filter((name) => name !== cal.name)
                                                        : [...selectedCalendars, cal.name]
                                                    setSelectedCarendars(newSelectedCalendars);
                                                }}
                                            />
                                        }
                                        label={`${cal.name} (${cal.count}件)`}
                                    />
                                )
                            })}
                        </FormGroup>
                        <LoadingButton
                            variant="outlined"
                            sx={{ my: 1, mx: "auto", width: 160 }}
                            onClick={() => {
                                console.log(selectedCalendars)
                            }}
                        >
                            エクスポート
                        </LoadingButton>
                    </Box>
                </>
            }
        </>
    );
}