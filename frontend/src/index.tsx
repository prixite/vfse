import React from "react";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "@src/App";
import { makeServer } from "@src/miragejs/server";
import { store } from "@src/store/store";
import theme from "@src/theme";

import "@src/index.scss";

const environment = process.env.NODE_ENV;
console.log(environment, 'sdasd')
if (environment !== "production") {
  makeServer({ environment });
}

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
