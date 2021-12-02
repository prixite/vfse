import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Link } from "react-router-dom";
import { routes } from "@src/routes/routes";
import { routeItem } from "@src/helpers/interfaces";
import "@src/components/Layout/SideBar/SideBar.scss";

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const collapsedLeftPadding = !open ? { paddingLeft: "22px" } : {};

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = () =>
    routes.map((prop: routeItem, key: number) => {
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

  return (
    <Box className="SideBar" sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          style={
            open ? { justifyContent: "flex-end" } : { justifyContent: "center" }
          }
        >
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              <MenuOpenIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {createLinks()}
          <ListItem button component="a" href="/accounts/logout/">
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
