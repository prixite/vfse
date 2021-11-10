import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <Main />
      </Router>
    </div>
  );
}
