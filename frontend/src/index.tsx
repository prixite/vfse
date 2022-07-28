import React from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@src/App";
import { makeServer } from "@src/miragejs/server";
import { store } from "@src/store/store";

import "@src/index.scss";

const environment = process.env.NODE_ENV;

if (environment !== "production") {
  makeServer({ environment });
}

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
