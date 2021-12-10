import * as React from "react";
import { Link } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Icon from "@src/assets/images/client.png";
import Logo from "@src/assets/images/logo.png";
import SearchIcon from "@src/assets/images/searchIcon.png";
import PlusIcon from "@src/assets/images/plusIcon.png";
import OpenBtn from "@src/assets/images/opendrawer.png";
import CloseBtn from "@src/assets/images/down.png";
import { routes } from "@src/routes";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import "@src/components/shared/Layout/SideBar/SideBar.scss";
import { useAppSelector } from "@src/store/hooks";
import { useMeReadQuery } from "@src/store/reducers/api";

const drawerWidth = 400;

const clients = ["cllient1", "cllient2", "cllient3"];

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
  const [open, setOpen] = React.useState(true);
  const [currentClient, setCurrentClient] = React.useState("cllient1");
  const { sideBarBackground, sideBarTextColor } = useAppSelector(
    (state) => state.myTheme
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
            to={prop.path}
            key={prop.path}
            style={collapsedLeftPadding}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={prop.name} />
          </ListItem>
        );
      });

  const createClients = () =>
    clients.map((item: string) => {
      return (
        <ListItem
          button
          key={item}
          style={collapsedLeftPadding}
          onClick={() => setCurrentClient(item)}
        >
          <ListItemIcon className={`client-image`}>
            <img
              src={Icon}
              className={`img ${currentClient === item ? "active" : ""}`}
            />
          </ListItemIcon>
        </ListItem>
      );
    });
  return (
    <Box className="SideBar" sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open} bgcolor={sideBarBackground}>
        <List className="leftLists">
          <ListItem button component="a" href="/">
            <ListItemIcon>
              <img src={Logo} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="a" href="/" className="item-margin">
            <ListItemIcon>
              <img src={PlusIcon} />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            component="a"
            href="/"
            className="item-margin"
            style={{ marginBottom: "40px" }}
          >
            <ListItemIcon>
              <img src={SearchIcon} />
            </ListItemIcon>
          </ListItem>
          {createClients()}
          <ListItem button component="a" href="/accounts/logout/">
            <ListItemText primary="Logout" />
          </ListItem>
          <ListItem
            button
            className="drawer-btn open-btn"
            onClick={handleDrawerOpen}
          >
            <ListItemIcon>
              <img src={OpenBtn} />
            </ListItemIcon>
          </ListItem>
        </List>
        <List style={{ position: "relative" }}>
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
