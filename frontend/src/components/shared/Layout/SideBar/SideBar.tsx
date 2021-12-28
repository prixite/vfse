import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
// import SearchIcon from "@src/assets/images/searchIcon.png";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import CloseBtn from "@src/assets/images/down.png";
import OpenBtn from "@src/assets/images/opendrawer.png";
import user from "@src/assets/images/user.png";
import ProfilePopOver from "@src/components/common/Presentational/ProfilePopOver/ProfilePopOver";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import { constants } from "@src/helpers/utils/constants";
import { routes } from "@src/routes";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import {
  Organization,
  useMeReadQuery,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";
import { openAddModal } from "@src/store/reducers/appStore";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
} from "@src/store/reducers/themeStore";

import "@src/components/shared/Layout/SideBar/SideBar.scss";

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
  const { sideBarBackground, sideBarTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { data: me } = useMeReadQuery();
  const toggleDrawer = () => {
    setOpen((prevState) => !prevState);
  };
  const collapsedLeftPadding = !open ? { paddingLeft: "22px" } : {};
  React.useEffect(() => {
    setCurrentClient(selectedOrganization);
    setCurrentRoute(pathRoute);
  }, [selectedOrganization]);
  const handleUpdateSelectedOrganization = (item) => {
    dispatch(setSelectedOrganization({ selectedOrganization: item }));
    dispatch(updateSideBarColor(item.appearance.sidebar_color));
    dispatch(updateButtonColor(item.appearance.primary_color));
    dispatch(updateSideBarTextColor(item.appearance.sidebar_text));
    dispatch(updateButtonTextColor(item.appearance.button_text));
    history.replace(`/${organizationRoute}/${item.id}`);
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = () =>
    routes
      .filter((item) => me?.flags?.indexOf(item.flag) !== -1)
      .map((prop: routeItem) => {
        return (
          <ListItem
            button
            component={Link}
            to={`/${organizationRoute}/${selectedOrganization?.id}${prop.path}`}
            key={prop.path}
            className={
              currentRoute ===
              `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                ? "active-link"
                : ""
            }
            onClick={() =>
              setCurrentRoute(
                `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
              )
            }
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
    !isOrgListLoading && organizationsList
      ? organizationsList?.slice(0, 5).map((item: Organization) => {
          return (
            <ListItem
              button
              key={item.id}
              style={collapsedLeftPadding}
              onClick={() => handleUpdateSelectedOrganization(item)}
            >
              <ListItemIcon
                className={`client-image ${
                  currentClient?.name === item?.name ? "active" : ""
                }`}
              >
                <img src={item.appearance.logo} className={`img`} />
              </ListItemIcon>
            </ListItem>
          );
        })
      : null;

  const onSearchClick = () => {
    history.push(`/${organizationRoute}/${selectedOrganization?.id}/`);
    setCurrentRoute("/");
    window.setTimeout(function () {
      document.getElementById("search-clients").focus();
    }, 0);
  };
  return (
    <Box className="SideBar" id="SideBarcontainer" sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        bgcolor={sideBarBackground}
        textcolor={sideBarTextColor}
      >
        <List className="leftLists">
          <ListItem button component="a" href="/">
            <ListItemIcon className="client-image">
              <img
                src={selectedOrganization?.appearance?.logo}
                className="img"
              />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="a" className="item-margin">
            <ListItemIcon style={{ color: sideBarTextColor }}>
              <AddIcon
                onClick={() => {
                  history.push(
                    `/${organizationRoute}/${selectedOrganization?.id}/`
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
              <SearchIcon onClick={onSearchClick} />
            </ListItemIcon>
          </ListItem>
          {!isOrgListLoading && createClients()}
          <ListItem
            button
            className="drawer-btn open-btn"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              {open ? <img src={CloseBtn} /> : <img src={OpenBtn} />}
            </ListItemIcon>
          </ListItem>
          <ListItem button className="user-image">
            <ListItemIcon>
              <ProfilePopOver user={user} className="image" />
            </ListItemIcon>
          </ListItem>
        </List>
        <List style={{ position: "relative" }} className="right-content">
          {createLinks()}
        </List>
      </Drawer>
    </Box>
  );
}
