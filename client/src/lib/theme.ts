import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        background: {
            default: "#f5f5f7",
            paper: "#fff",
        },
        text: {
            primary: "#173A5E",
            secondary: "#46505A",
        },
      },
    typography: {
        button: {
            textTransform: "none"
        }
    }
});

export default theme;