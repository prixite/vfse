import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.scss";
import SideBar from "../sidebar/SideBar";
import Content from "../content/Content";

export default function App() {
  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      <BrowserRouter>
        <div className="mid">
          <div>
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

function Header() {
  return <h1>vFSE</h1>;
}
