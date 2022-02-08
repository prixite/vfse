import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
// import SearchIcon from "@src/assets/images/searchIcon.png";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import CloseBtn from "@src/assets/images/down.png";
import OpenBtn from "@src/assets/images/opendrawer.png";
import ProfilePopOver from "@src/components/common/Presentational/ProfilePopOver/ProfilePopOver";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import { constants } from "@src/helpers/utils/constants";
import { hexToRgb } from "@src/helpers/utils/utils";
import { routes, vfseRoutes } from "@src/routes";
import {
  useAppSelector,
  useAppDispatch,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  Organization,
  useOrganizationsListQuery,
  useOrganizationsMeReadQuery,
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
  const [openVfse, setOpenVfse] = React.useState(false);
  const [currentClient, setCurrentClient] =
    React.useState<Organization>(Object);
  const pathRoute = window.location.pathname;
  const [currentRoute, setCurrentRoute] = React.useState(pathRoute);
  const { organizationRoute } = constants;
  const { data: organizationsList, isLoading: isOrgListLoading } =
    useOrganizationsListQuery({ page: 1 });
  const { sideBarBackground, sideBarTextColor, buttonBackground } =
    useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();

  const { data: me } = useOrganizationsMeReadQuery({
    id: selectedOrganization.id.toString(),
  });
  const toggleDrawer = () => {
    setOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    setCurrentClient(selectedOrganization);
    if (
      pathRoute.includes(
        `/${organizationRoute}/${selectedOrganization?.id}/networks/`
      ) ||
      pathRoute.includes(
        `/${organizationRoute}/${selectedOrganization?.id}/sites/`
      )
    ) {
      setCurrentRoute(`/${organizationRoute}/${selectedOrganization?.id}/`);
    } else {
      setCurrentRoute(pathRoute);
    }
  }, [selectedOrganization, pathRoute]);
  const handleUpdateSelectedOrganization = (item) => {
    dispatch(setSelectedOrganization({ selectedOrganization: item }));
    dispatch(updateSideBarColor(item.appearance.sidebar_color));
    dispatch(updateButtonColor(item.appearance.primary_color));
    dispatch(updateSideBarTextColor(item.appearance.sidebar_text));
    dispatch(updateButtonTextColor(item.appearance.button_text));
    history.replace(`/${organizationRoute}/${item.id}`);
  };

  const handleVfseClick = () => {
    setOpenVfse(!openVfse);
  };

  const checkVfseRoutes = () => {
    if (
      currentRoute?.includes("knowledge-base") ||
      currentRoute?.includes("forum") ||
      currentRoute?.includes("faq")
    ) {
      return true;
    }
    return false;
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = () =>
    routes
      .filter((item) => me?.flags?.indexOf(item.flag) !== -1)
      .map((prop: routeItem) => {
        return prop.name !== "vFSE" ? (
          <ListItem
            button
            component={Link}
            to={`/${organizationRoute}/${selectedOrganization?.id}${prop.path}`}
            key={prop.path}
            style={
              currentRoute ===
              `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                ? {
                    borderRadius: "4px",
                    backgroundColor: hexToRgb(buttonBackground, 0.5),
                  }
                : {}
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
        ) : (
          <>
            <ListItem
              button
              key={prop.path}
              style={
                checkVfseRoutes()
                  ? {
                      borderRadius: "4px",
                      backgroundColor: hexToRgb(buttonBackground, 0.5),
                    }
                  : openVfse
                  ? {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }
                  : {}
              }
              onClick={handleVfseClick}
            >
              <ListItemIcon
                style={{ color: sideBarTextColor, marginRight: "10px" }}
              >
                <prop.icon />
              </ListItemIcon>
              <ListItemText primary={prop.name} />
              {openVfse ? (
                <ExpandLessIcon style={{ color: sideBarTextColor }} />
              ) : (
                <ExpandMoreIcon style={{ color: sideBarTextColor }} />
              )}
            </ListItem>
            <Collapse
              in={openVfse}
              timeout="auto"
              unmountOnExit
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
              }}
            >
              <List component="div" disablePadding>
                {vfseRoutes?.map((route: routeItem) => (
                  <ListItem
                    button
                    sx={{ pl: 4 }}
                    component={Link}
                    key={route.path}
                    to={`/${organizationRoute}/${selectedOrganization?.id}${route.path}`}
                    style={
                      currentRoute ===
                      `/${organizationRoute}/${selectedOrganization?.id}${route.path}`
                        ? {
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                          }
                        : {}
                    }
                    onClick={() =>
                      setCurrentRoute(
                        `/${organizationRoute}/${selectedOrganization?.id}${route.path}`
                      )
                    }
                  >
                    <ListItemText
                      style={{ paddingLeft: "16px" }}
                      primary={route.name}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        );
      });

  const createClients = () =>
    !isOrgListLoading && organizationsList
      ? organizationsList?.slice(0, 5).map((item: Organization) => {
          return (
            <ListItem
              button
              key={item.id}
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
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
    setCurrentRoute(`/${organizationRoute}/${selectedOrganization?.id}/`);
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
          <ListItem button style={{ marginBottom: "0px", cursor: "initial" }}>
            <ListItemIcon
              className="client-image"
              style={{ marginBottom: "0px", cursor: "initial" }}
            >
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
            style={{ marginBottom: "10px" }}
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
              <ProfilePopOver
                profilePicture={me?.profile_picture}
                className="image"
              />
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
