import { Switch, Route } from "react-router-dom";
import { Box, Toolbar, Typography } from "@mui/material";
import DesignSystem from "@src/views/design-system/DesignSystem";
import Documentation from "@src/views/documentation/Documentation";
import Modality from "@src/views/modality/Modality";
import Organization from "@src/views/organization/Organization";
import User from "@src/views/user/User";
import Home from "@src/views/vfse/Vfse";

const drawerWidth = 296;

export default function Content() {
  return (
    <Box
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Typography paragraph>
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
      </Typography>
    </Box>
  );
}
