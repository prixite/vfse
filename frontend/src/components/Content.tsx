import { Switch, Route, Redirect } from "react-router-dom";
import { Box } from "@mui/material";
import { routes } from "@src/Routes/Routes";

const Content = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#F5F6F7" }}>
      <Switch>
        {routes.map((route, key) => (
          <Route
            path={route.path}
            component={route.component}
            key={key}
            exact
          />
        ))}
        <Redirect to="/" />
      </Switch>
    </Box>
  );
};
export default Content;
