import React from "react";
import { BrowserRouter } from "react-router-dom";

import "@src/components/App.scss";
import SideBar from "@src/components/SideBar";
import Content from "@src/components/Content";
import Header from "@src/components/Header";
import { Box } from "@mui/material";

export default function App() {
  return (
    <React.Fragment>
      <Header />
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <SideBar />
          <Content />
        </Box>
      </BrowserRouter>
    </React.Fragment>
  );
}
