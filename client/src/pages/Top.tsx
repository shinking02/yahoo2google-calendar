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
    const [importResponse, setimportResponse] = React.useState<apiType.ImportResponse | null>(null);
    const [selectedCalendars, setSelectedCarendars] = React.useState<string[]>([]);
    const [exporting, setExporting] = React.useState<boolean>(false);
    const [exportResponse, setExportResponse] = React.useState<apiType.ExportResponse | null>(null);
    useEffect(() => {
        const existAccessToken = document.cookie.includes("access_token");
        const existRefreshToken = document.cookie.includes("refresh_token");
        setIsLogin(existAccessToken && existRefreshToken);        
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
        const response = await post("/importCal", { from: fromDate, to: toDate }) as apiType.ImportResponse;
        setImporting(false);
        setimportResponse(response);
        const initialCalendars = response.calList.map((cal) => cal.name) || [];
        setSelectedCarendars(initialCalendars);
        console.log(response);
    }
    const exportHandler = async() => {
        setExporting(true);
        const response = await post("/exportCal");
        setExporting(false);
        setExportResponse(response);
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
                {importResponse && (
                    <Alert severity={importResponse.error ? "error" : "success"} sx={{ mt: 1 }}>
                        {importResponse.message}
                    </Alert>
                )}
            </Box>
            {importResponse && importResponse.events && importResponse.events.length > 0 &&
                <>
                    <Box sx={{ color: "text.secondary", fontSize: 20, fontWeight: "bold", mt: 2}}>エクスポート</Box>
                    <Box sx={{
                        width: 480,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <FormGroup sx={{ ml: 10 }}>
                            {importResponse.calList.map(cal => {
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
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                              <span
                                                style={{
                                                  width: 16,
                                                  height: 16,
                                                  borderRadius: '50%',
                                                  background: cal.color,
                                                  marginRight: 8,
                                                }}
                                              />
                                              {`${cal.name} (${cal.count}件)`}
                                            </div>
                                          }
                                    />
                                )
                            })}
                        </FormGroup>
                        <LoadingButton
                            variant="outlined"
                            sx={{ my: 1, mx: "auto", width: 160 }}
                            loading={exporting}
                            onClick={exportHandler}
                            disabled={!selectedCalendars.length}
                        >
                            エクスポート
                        </LoadingButton>
                        {exportResponse && (
                            <Alert severity={exportResponse.error ? "error" : "success"} sx={{ mt: 1 }}>
                                {exportResponse.message}
                            </Alert>
                        )}
                    </Box>
                </>
            }
        </>
    );
}