import { Switch, Route } from "react-router-dom";
import { Box } from "@mui/material";
import DocumentationView from "@src/views/documentation/Documentation";
import ModalityView from "@src/views/modality/Modality";
import OrganizationView from "@src/views/organization/Organization";
import UserView from "@src/views/user/User";
import VfseView from "@src/views/vfse/Vfse";
import HomeView from "@src/views/home/Home";

export default function Content() {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#F5F6F7" }}>
      <Switch>
        <Route path="/organizations">
          <OrganizationView />
        </Route>
        <Route path="/users">
          <UserView />
        </Route>
        <Route path="/modality">
          <ModalityView />
        </Route>
        <Route path="/documentation">
          <DocumentationView />
        </Route>
        <Route path="/vfse">
          <VfseView />
        </Route>
        <Route path="/">
          <HomeView />
        </Route>
      </Switch>
    </Box>
  );
}
