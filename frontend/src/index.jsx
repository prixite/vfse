import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from '@mui/material/CssBaseline';

import App from "./components/app/App";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
  document.getElementById("container")
);
