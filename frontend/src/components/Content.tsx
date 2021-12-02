import { Switch, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Documentation from "@src/views/documentation/Documentation";
import Modality from "@src/views/modality/Modality";
import OrganizationView from "@src/views/organization/Organization";
import User from "@src/views/user/User";
import Vfse from "@src/views/vfse/Vfse";
import Home from "@src/views/home/Home";

export default function Content() {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#F5F6F7" }}>
      <Switch>
        <Route path="/organizations">
          <OrganizationView />
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
        <Route path="/vfse">
          <Vfse />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Box>
  );
}
