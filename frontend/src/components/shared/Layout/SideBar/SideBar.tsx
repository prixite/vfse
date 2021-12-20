import * as React from "react";
import { Link } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useHistory } from "react-router";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import user from "@src/assets/images/user.png";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Logo from "@src/assets/images/logo.png";
// import SearchIcon from "@src/assets/images/searchIcon.png";
import OpenBtn from "@src/assets/images/opendrawer.png";
import CloseBtn from "@src/assets/images/down.png";
import TopicIcon from "@mui/icons-material/Topic";
import { constants } from "@src/helpers/utils/constants";
import { routes } from "@src/routes";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import "@src/components/shared/Layout/SideBar/SideBar.scss";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import { openAddModal } from "@src/store/reducers/appStore";
import {
  Organization,
  useMeReadQuery,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";
import ProfilePopOver from "@src/components/common/Presentational/ProfilePopOver/ProfilePopOver";

const drawerWidth = 400;

const openedMixin = (
  theme: Theme,
  bgcolor: string,
  textcolor: string
): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: bgcolor,
  color: textcolor,
});

const closedMixin = (
  theme: Theme,
  bgcolor: string,
  textcolor: string
): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
  backgroundColor: bgcolor,
  color: textcolor,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, bgcolor, textcolor }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, bgcolor, textcolor),
    "& .MuiDrawer-paper": openedMixin(theme, bgcolor, textcolor),
  }),
  ...(!open && {
    ...closedMixin(theme, bgcolor, textcolor),
    "& .MuiDrawer-paper": closedMixin(theme, bgcolor, textcolor),
  }),
}));

export default function SideBar() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const [currentClient, setCurrentClient] =
    React.useState<Organization>(Object);
  const pathRoute = window.location.pathname;
  const [currentRoute, setCurrentRoute] = React.useState(pathRoute);
  const { organizationRoute } = constants;
  const { data: organizationsList, isLoading: isOrgListLoading } =
    useOrganizationsListQuery({ page: 1 });
  const {
    sideBarBackground,
    sideBarTextColor,
    buttonTextColor,
    buttonBackground,
  } = useAppSelector((state) => state.myTheme);
  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const { data: me, isFetching } = useMeReadQuery();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const collapsedLeftPadding = !open ? { paddingLeft: "22px" } : {};

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = () =>
    routes
      .filter((item) => me.flags.indexOf(item.flag) !== -1)
      .map((prop: routeItem) => {
        return (
          <ListItem
            button
            component={Link}
            to={`/${organizationRoute}/${currentOrganization?.id}${prop.path}`}
            key={prop.path}
            className={currentRoute === `/${organizationRoute}/${currentOrganization?.id}${prop.path}` ? "active-link" : ""}
            onClick={() => setCurrentRoute(`/${organizationRoute}/${currentOrganization?.id}${prop.path}`)}
          >
            <ListItemIcon
              style={{ color: sideBarTextColor, marginRight: "10px" }}
            >
              <prop.icon />
            </ListItemIcon>
            <ListItemText primary={prop.name} />
          </ListItem>
        );
      });

  const createClients = () =>
    organizationsList.slice(0, 5).map((item: Organization) => {
      return (
        <ListItem
          button
          component={Link}
          to={`/${organizationRoute}/${item?.id}`}
          key={item.id}
          style={collapsedLeftPadding}
          onClick={() => setCurrentClient(item)}
        >
          <ListItemIcon
            className={`client-image ${
              currentClient.name === item.name ? "active" : ""
            }`}
          >
            <img src={item.appearance.logo} className={`img`} />
          </ListItemIcon>
        </ListItem>
      );
    });
  return (
    <Box className="SideBar" sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        bgcolor={sideBarBackground}
        textcolor={sideBarTextColor}
      >
        <List className="leftLists">
          <ListItem button component="a" href="/">
            <ListItemIcon>
              <img src={Logo} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="a" className="item-margin">
            <ListItemIcon style={{ color: sideBarTextColor }}>
              <AddIcon
                onClick={() => {
                  history.push(
                    `/${organizationRoute}/${currentOrganization?.id}/`
                  );
                  setCurrentRoute("/");
                  dispatch(openAddModal());
                }}
              />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            component="a"
            className="item-margin"
            style={{ marginBottom: "40px" }}
          >
            <ListItemIcon style={{ color: sideBarTextColor }}>
              <SearchIcon
                onClick={() => {
                  history.push(
                    `/${organizationRoute}/${currentOrganization?.id}/`
                  );
                  setCurrentRoute("/");
                }}
              />
            </ListItemIcon>
          </ListItem>
          {!isOrgListLoading && createClients()}
          <ListItem
            button
            className="drawer-btn open-btn"
            onClick={handleDrawerOpen}
          >
            <ListItemIcon>
              <img src={OpenBtn} />
            </ListItemIcon>
          </ListItem>
          <ListItem button className="user-image">
            <ListItemIcon>
              <ProfilePopOver user={user} className="image" />
            </ListItemIcon>
          </ListItem>
        </List>
        <List style={{ position: "relative" }} className="right-content">
          <ListItem
            button
            className="drawer-btn open-btn"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <img src={CloseBtn} />
            </ListItemIcon>
          </ListItem>
          {createLinks()}
        </List>
      </Drawer>
    </Box>
  );
}
