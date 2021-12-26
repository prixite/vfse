import React from "react";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom";

import "@src/index.scss";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@src/App";
import { store } from "@src/store/store";
import theme from "@src/theme";
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("container")
);
