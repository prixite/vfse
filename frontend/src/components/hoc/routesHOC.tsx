import { lazy } from "react";

import { Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { routes, vfseRoutes } from "@src/routes";

const OrganizationView = lazy(
  async () =>
    import(
      /* webpackChunkName: "OrganizationView" */ "@src/views/organization/OrganizationView"
    )
);

const ArticleDocumentation = lazy(
  async () =>
    import(
      /* webpackChunkName: "ArticleDocumentation" */ "@src/views/articleDocumentation/ArticleDocumentation"
    )
);

const FolderView = lazy(
  async () =>
    import(
      /* webpackChunkName: "FolderView" */ "@src/views/folderView/FolderView"
    )
);

const HomeView = lazy(
  async () =>
    import(/* webpackChunkName: "HomeView" */ "@src/views/home/HomeView")
);

const NotFoundPage = lazy(
  async () =>
    import(
      /* webpackChunkName: "NotFoundPage" */ "@src/views/notFoundPage/NotFoundPage"
    )
);

const SitesView = lazy(
  async () =>
    import(/* webpackChunkName: "SitesView" */ "@src/views/sites/SitesView")
);

const SystemsView = lazy(
  async () =>
    import(
      /* webpackChunkName: "SystemsView" */ "@src/views/systems/SystemsView"
    )
);

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
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/folder/:folderId/documentation/:docId`}
            component={ArticleDocumentation}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/documentation/:docId`}
            component={ArticleDocumentation}
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
