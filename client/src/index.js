import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/style.css";
import App from "./App";
import { AuthContextProvider } from "./utils/AuthContext";
import { POTDContextProvider } from "./utils/POTDContext";
import ScrollTop from "./components/ScrollTop";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#224957",
    },
    secondary: {
      main: "#20DF7F",
    },
  },
  typography: {
    fontFamily: "Lexend Deca",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightBold: 700,
    fontWeightMedium: 600,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <POTDContextProvider>
          <div id="back-to-top-anchor"></div>
          <App />
          <ScrollTop></ScrollTop>
        </POTDContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
