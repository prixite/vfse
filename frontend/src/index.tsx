import React from "react";

import { Buffer } from "buffer";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@src/App";
import "./i18n";
import { store } from "@src/store/store";

import "@src/index.scss";
window.Buffer = Buffer;

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("container")
);
