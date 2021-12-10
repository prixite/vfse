import * as React from "react";
import { Link } from "react-router-dom";
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
import { useAppSelector } from "@src/store/hooks";
import { useMeReadQuery } from "@src/store/reducers/api";
import DefaultLogo from "@src/assets/626-Logo-White.png";

const drawerWidth = 320;

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
  const { sideBarBackground, sideBarTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  console.log(sideBarBackground, sideBarTextColor);

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

  return (
    <Box className="SideBar" sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        bgcolor={sideBarBackground}
        textcolor={sideBarTextColor}
      >
        <DrawerHeader
          style={
            open ? { justifyContent: "flex-end" } : { justifyContent: "center" }
          }
        >
          <img src={DefaultLogo} width={50} />
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
