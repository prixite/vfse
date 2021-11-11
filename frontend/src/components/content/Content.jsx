import { Switch, Route } from "react-router-dom";
import DesignSystem from "./design-system/DesignSystem";
import Documentation from "./documentation/Documentation";
import Modality from "./modality/Modality";
import Organization from "./organization/Organization";
import User from "./user/User";
import Home from "./vfse/Vfse";

export default function Content() {
  return (
    <Switch>
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
      <Route path="/design">
        <DesignSystem />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}
