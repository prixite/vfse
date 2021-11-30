import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";

import "@src/index.scss";

import App from "@src/components/App";
import theme from "@src/theme";
import { store } from "./store/store";
import { Provider } from "react-redux";
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("container")
);
