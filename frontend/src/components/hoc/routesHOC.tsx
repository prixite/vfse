import { lazy, Suspense } from "react";

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

const CategoryDetailView = lazy(
  async () =>
    import(
      /* webpackChunkName: "CategoryDetailView" */ "@src/views/categoryDetail/CategoryDetailView"
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
              render={() => (
                <Suspense fallback={<p>Loading...</p>}>
                  <route.component />
                </Suspense>
              )}
              key={key}
              exact
            />
          ))}
          {vfseRoutes.map((route, key) => (
            <Route
              path={`/${organizationRoute}/:id${route.path}`}
              render={() => (
                <Suspense fallback={<p>Loading...</p>}>
                  <route.component />
                </Suspense>
              )}
              key={key}
              exact
            />
          ))}
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <OrganizationView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <OrganizationView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <SitesView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/:siteId/systems`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <SystemsView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/:siteId/systems`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <SystemsView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/category/:categoryId/folder/:folderId`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <FolderView />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/folder/:folderId/documentation/:docId`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <ArticleDocumentation />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/documentation/:docId`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <ArticleDocumentation />
              </Suspense>
            )}
            exact
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/category/:categoryId`}
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <CategoryDetailView />
              </Suspense>
            )}
            exact
          />
          <Route
            path="/"
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <HomeView />
              </Suspense>
            )}
            exact
          />
          <Route
            path="*"
            render={() => (
              <Suspense fallback={<p>Loading...</p>}>
                <NotFoundPage />
              </Suspense>
            )}
          />
        </Switch>
      ) : (
        <p>Loading Main</p>
      )}
    </Box>
  );
};
export default RoutesHOC;
