import { Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { routes } from "@src/routes";
import HomeView from "@src/views/home/HomeView";
import NotFoundPage from "@src/views/NotFoundPage/NotFoundPage";
import SitesView from "@src/views/sites/SitesView";

const RoutesHOC = () => {
  const { organizationRoute, networkRoute, sitesRoute } = constants;
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#F5F6F7" }}>
      <Switch>
        {routes.map((route, key) => (
          <Route
            path={`/${organizationRoute}/:id${route.path}`}
            component={route.component}
            key={key}
            exact
          />
        ))}
        <Route
          path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}`}
          component={SitesView}
          exact
        />
        <Route path="/" component={HomeView} exact />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Box>
  );
};
export default RoutesHOC;
