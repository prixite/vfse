import React from "react";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Registeration from "@src/requests/src/Registeration";
import { store } from "@src/requests/src/store/store";
import theme from "@src/requests/src/theme";

import "@src/index.scss";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme()}>
        <CssBaseline />
        <Registeration />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("container")
);
