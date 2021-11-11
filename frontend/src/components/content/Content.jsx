import { Switch, Route } from "react-router-dom";
import Documentation from "./documentation/Documentation";
import Modality from "./modality/Modality";
import Organization from "./organization/Organization";
import User from "./user/User";
import Home from "./vfse/Vfse";

export default function Content() {
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/organizations">
        <Organization />
      </Route>
      <Route path="/users">
        <User />
      </Route>
      <Route path="/modality">
        <Modality />
      </Route>
      <Route path="/documentation">
        <Documentation />
      </Route>
    </Switch>
  );
}
