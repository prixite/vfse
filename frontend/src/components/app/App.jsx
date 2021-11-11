import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import "./App.scss";
import SideBar from "../sidebar/SideBar";

export default function App() {
  return (
    <React.Fragment>
      <div><Header /></div>
      <Router>
        <div className='mid'>
          <div><SideBar /></div>
          <div className="content">
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>

        </div>
      </Router>
    </React.Fragment>
  );
}

function Header() {
  return <h1>vFSE</h1>;
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
