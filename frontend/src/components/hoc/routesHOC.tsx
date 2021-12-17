import { Switch, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { routes } from "@src/routes";
import NotFoundPage from "@src/views/NotFoundPage/NotFoundPage";
import HomeView from "@src/views/home/HomeView";
import { constants } from "@src/helpers/utils/constants";

const RoutesHOC = () => {
  const { organizationRoute } = constants;
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
        <Route path="/" component={HomeView} exact />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Box>
  );
};
export default RoutesHOC;
