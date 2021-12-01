import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "@src/components/App.scss";
import SideBar from "@src/components/SideBar";
import Content from "@src/components/Content";
import { Box } from "@mui/material";
export default function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <SideBar />
          <Content />
        </Box>
      </BrowserRouter>
    </React.Fragment>
  );
}
