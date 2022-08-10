import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "@src/requests/src/App";
import { store } from "@src/requests/src/store/store";

import "@src/index.scss";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("container")
);
