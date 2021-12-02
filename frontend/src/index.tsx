import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";

import "@src/index.scss";

import App from "@src/App";
import theme from "@src/theme";
import { store } from "@src/store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
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
