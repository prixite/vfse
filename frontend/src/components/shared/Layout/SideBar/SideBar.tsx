import * as React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { routes } from "@src/routes";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import "@src/components/shared/Layout/SideBar/SideBar.scss";
import { RootState } from "@src/store/store";
import { Me } from "@src/store/reducers/api";
import { useAppSelector } from "@src/store/hooks";

const drawerWidth = 320;

const openedMixin = (theme: Theme, bgcolor: string): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: bgcolor,
});

const closedMixin = (theme: Theme, bgcolor: string): CSSObject => ({
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
})(({ theme, open, bgcolor }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, bgcolor),
    "& .MuiDrawer-paper": openedMixin(theme, bgcolor),
  }),
  ...(!open && {
    ...closedMixin(theme, bgcolor),
    "& .MuiDrawer-paper": closedMixin(theme, bgcolor),
  }),
}));

export default function SideBar() {
  const [open, setOpen] = React.useState(true);
  const { sideBarBackground } = useAppSelector((state) => state.myTheme);

  const { me } = useAppSelector((state) => state.me);

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
      .map((prop: routeItem, key: number) => {
        return (
          <ListItem
            key={key}
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
      <Drawer variant="permanent" open={open} bgcolor={sideBarBackground}>
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
