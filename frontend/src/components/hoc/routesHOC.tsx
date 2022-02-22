import { Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { routes, vfseRoutes } from "@src/routes";
import HomeView from "@src/views/home/HomeView";
import NotFoundPage from "@src/views/NotFoundPage/NotFoundPage";
import OrganizationView from "@src/views/organization/OrganizationView";
import SitesView from "@src/views/sites/SitesView";
import SystemsView from "@src/views/systems/SystemsView";
import FolderView from "@src/views/folderView/FolderView";

interface Props {
  isLoading: boolean;
}
const RoutesHOC = ({ isLoading }: Props) => {
  const { organizationRoute, networkRoute, sitesRoute } = constants;
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#F5F6F7",
        overflowX: "hidden",
      }}
      className="main-content"
    >
      {!isLoading ? (
        <Switch>
          {routes.map((route, key) => (
            <Route
              path={`/${organizationRoute}/:id${route.path}`}
              component={route.component}
              key={key}
              exact
            />
          ))}
          {vfseRoutes.map((route, key) => (
            <Route
              path={`/${organizationRoute}/:id${route.path}`}
              component={route.component}
              key={key}
              exact
            />
          ))}
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/`}
            component={OrganizationView}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/`}
            component={OrganizationView}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/`}
            component={SitesView}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/:siteId/systems`}
            component={SystemsView}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/:siteId/systems`}
            component={SystemsView}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/folder/:folderId`}
            component={FolderView}
            exact
          />

          <Route path="/" component={HomeView} exact />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      ) : (
        <p>Loading Main</p>
      )}
    </Box>
  );
};
export default RoutesHOC;
