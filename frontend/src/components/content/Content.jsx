import { Switch, Route } from "react-router-dom";
import DesignSystem from "@src/components/content/design-system/DesignSystem";
import Documentation from "@src/components/content/documentation/Documentation";
import Modality from "@src/components/content/modality/Modality";
import Organization from "@src/components/content/organization/Organization";
import User from "@src/components/content/user/User";
import Home from "@src/components/content/vfse/Vfse";

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
