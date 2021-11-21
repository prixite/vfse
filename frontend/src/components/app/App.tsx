import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.scss";
import SideBar from "@src/components/sidebar/SideBar";
import Content from "@src/components/content/Content";
import Header from "@src/components/header/Header";

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
