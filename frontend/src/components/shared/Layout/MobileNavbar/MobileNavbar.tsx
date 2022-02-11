import {useState} from 'react';
import { List,ListItem,ListItemText,ListItemIcon } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import { routes} from "@src/routes";
import { Link } from "react-router-dom";
import { constants } from "@src/helpers/utils/constants";
import { hexToRgb } from "@src/helpers/utils/utils";
import "@src/components/shared/Layout/MobileNavbar/MobileNavbar.scss";
import { useOrganizationsMeReadQuery } from '@src/store/reducers/api';
import { useAppSelector, useSelectedOrganization } from '@src/store/hooks';

const MobileNavbar = () => {
  const pathRoute = window.location.pathname;
  const [currentRoute, setCurrentRoute] = useState(pathRoute);
  const { organizationRoute } = constants;
  const selectedOrganization = useSelectedOrganization();
  const {  sideBarTextColor, buttonBackground ,fontTwo } =
    useAppSelector((state) => state.myTheme);
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );
  const createLinks = () =>
  routes
    .filter((item) => me?.flags?.indexOf(item.flag) !== -1)
    .map((prop: routeItem) => {
      const splittedName = prop?.name.split(" ");
      return  (
        <ListItem
          button
          component={Link}
          to={`/${organizationRoute}/${selectedOrganization?.id}${prop.path}`}
          key={prop.path}
          className="MobileDrawerList"
          onClick={() =>
            setCurrentRoute(
              `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
            )
          }
        >
          <ListItemIcon
          className="ListIcon"
            style={
              currentRoute ===
              `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                ? { color : "#fff",
                    borderRadius: "4px",
                    backgroundColor: hexToRgb(buttonBackground, 0.5),
                  }
                : { 
                    color : sideBarTextColor,
                    justifyContent : "center",
                }
            }
          >
            <prop.icon />
          </ListItemIcon>
          <ListItemText primary={splittedName[0]} 
          style={
            currentRoute ===
            `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
              ? { color : "#fff",
                  textAlign:"center", 
                  fontFamily : fontTwo
                }
              : { 
                  color : sideBarTextColor,
                  textAlign:"center", 
                  fontFamily : fontTwo
              }
          }
          />
        </ListItem>
      )
    });


  return (
    <>
      <AppBar position="fixed" className="MobileNavbar"  sx={{ top: 'auto', bottom: 0,zIndex :1000 }}>
        <Toolbar>
        <List style={{ position: "relative" }} className="mobile-content">
          {createLinks()}
        </List>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default MobileNavbar;