import React, { useEffect, Fragment } from "react";

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
import { useNavigate, Link } from "react-router-dom";

import CloseBtn from "@src/assets/images/down.png";
import OpenBtn from "@src/assets/images/opendrawer.png";
import ProfilePopOver from "@src/components/common/presentational/profilePopOver/ProfilePopOver";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import MobileNavbar from "@src/components/shared/layout/mobileNavbar/MobileNavbar";
import { routeItem } from "@src/types/interfaces";
import { mobileWidth } from "@src/helpers/utils/config";
import { constants } from "@src/helpers/utils/constants";
import { hexToRgb } from "@src/helpers/utils/utils";
import { routes, vfseRoutes } from "@src/routes";
import {
  useAppSelector,
  useAppDispatch,
  useSelectedOrganization,
} from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import { openAddModal } from "@src/store/reducers/appStore";
import "@src/components/shared/layout/sideBar/sideBar.scss";

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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const [openVfse, setOpenVfse] = React.useState(false);
  const [browserWidth] = useWindowSize();
  const pathRoute = window.location.pathname;
  const [currentRoute, setCurrentRoute] = React.useState(pathRoute);
  const { organizationRoute } = constants;
  const { sideBarBackground, sideBarTextColor, buttonBackground, fontOne } =
    useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();

  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );
  const toggleDrawer = () => {
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
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
    if (screen.width > 1030) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedOrganization, pathRoute, screen.width]);

  const handleVfseClick = () => {
    setOpenVfse(!openVfse);
  };

  useEffect(() => {
    if (
      currentRoute?.includes("knowledge-base") ||
      currentRoute?.includes("forum") ||
      currentRoute?.includes("faq")
    ) {
      setOpenVfse(true);
    } else {
      setOpenVfse(false);
    }
  }, [currentRoute]);

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
  const createLinks = () => {
    if (me?.flags) {
      return routes
        .filter((item) => me?.flags?.indexOf(item.flag) !== -1)
        .map((prop: routeItem, key) => {
          return prop.name !== "vFSE" ? (
            <Fragment key={key}>
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
            </Fragment>
          ) : (
            <Fragment key={key}>
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
                              fontStyle: fontOne,
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
            </Fragment>
          );
        });
    }
  };

  const onSearchClick = () => {
    navigate(`/${organizationRoute}/${selectedOrganization?.id}/`);
    setCurrentRoute(`/${organizationRoute}/${selectedOrganization?.id}/`);
    window.setTimeout(function () {
      document.getElementById("search-clients").focus();
    }, 0);
  };
  return (
    <>
      {browserWidth > mobileWidth ? (
        <Box className="SideBar" id="SideBarcontainer" sx={{ display: "flex" }}>
          {open ? <div className="overlay" onClick={toggleDrawer} /> : ""}
          <Drawer
            variant="permanent"
            open={open}
            bgcolor={sideBarBackground}
            textcolor={sideBarTextColor}
          >
            <List className="leftLists">
              <ListItem button onClick={toggleDrawer}>
                <ListItemIcon className="client-image">
                  <img
                    src={selectedOrganization?.appearance?.logo}
                    className="img"
                  />
                </ListItemIcon>
              </ListItem>
              {me?.is_superuser ? (
                <ListItem button component="a" className="item-margin">
                  <ListItemIcon style={{ color: sideBarTextColor }}>
                    <AddIcon
                      onClick={() => {
                        navigate(
                          `/${organizationRoute}/${selectedOrganization?.id}/`
                        );
                        setCurrentRoute("/");
                        dispatch(openAddModal());
                      }}
                    />
                  </ListItemIcon>
                </ListItem>
              ) : (
                ""
              )}
              <ListItem button component="a" className="item-margin">
                <ListItemIcon style={{ color: sideBarTextColor }}>
                  <SearchIcon onClick={onSearchClick} />
                </ListItemIcon>
              </ListItem>
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
      ) : (
        <MobileNavbar />
      )}
    </>
  );
}
