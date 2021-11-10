import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.scss";

export default function App() {
  return (
    <div>
      <Router>
        <Main />
      </Router>
    </div>
  );
}
