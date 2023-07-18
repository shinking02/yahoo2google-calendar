import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./lib/theme";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
)