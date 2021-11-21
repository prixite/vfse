import { Switch, Route } from "react-router-dom";
import DesignSystem from "../../views/design-system/DesignSystem";
import Documentation from "../../views/documentation/Documentation";
import Modality from "../../views/modality/Modality";
import Organization from "../../views/organization/Organization";
import User from "../../views/user/User";
import Home from "../../views/vfse/Vfse";

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
