import React from "react";
import { BrowserRouter } from "react-router-dom";

import "@src/components/App.scss";
import SideBar from "@src/components/SideBar";
import Content from "@src/components/Content";
import Header from "@src/components/Header";

export default function App() {
  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      <BrowserRouter>
        <div className="mid">
          <div className="sidebar">
            <SideBar />
          </div>
          <div className="content">
            <Content />
          </div>
        </div>
      </BrowserRouter>
    </React.Fragment>
  );
}
