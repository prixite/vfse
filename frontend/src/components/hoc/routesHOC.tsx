import { lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
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
const TopicView = lazy(
  async () =>
    import(
      /* webpackChunkName: "FolderView" */ "@src/views/topicView/TopicView"
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

import SystemsView from "../../views/systems/SystemsView";

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
        <Routes>
          {routes.map((route, key) => (
            <Route
              path={`/${organizationRoute}/:id${route.path}`}
              element={
                <Suspense fallback={<>Loading...</>}>
                  <route.component />
                </Suspense>
              }
              key={key}
            />
          ))}
          {vfseRoutes.map((route, key) => (
            <Route
              path={`/${organizationRoute}/:id${route.path}`}
              element={
                <Suspense fallback={<>Loading...</>}>
                  <route.component />
                </Suspense>
              }
              key={key}
            />
          ))}
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <OrganizationView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <OrganizationView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <SitesView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/${sitesRoute}/:siteId/systems`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <SystemsView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/${networkRoute}/:networkId/${sitesRoute}/:siteId/systems`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <SystemsView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/category/:categoryId/folder/:folderId`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <FolderView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/folder/:folderId/documentation/:docId`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <ArticleDocumentation />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/documentation/:docId`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <ArticleDocumentation />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/knowledge-base/category/:categoryId`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <CategoryDetailView />
              </Suspense>
            }
          />
          <Route
            path={`/${organizationRoute}/:id/forum/topic/:topicId`}
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <TopicView />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <HomeView />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      ) : (
        <p>Loading Main</p>
      )}
    </Box>
  );
};
export default RoutesHOC;
