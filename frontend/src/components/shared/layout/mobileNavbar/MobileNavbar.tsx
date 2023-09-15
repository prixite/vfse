import { useState, Fragment } from "react";

import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";

import ProfilePopOver from "@src/components/common/presentational/profilePopOver/ProfilePopOver";
import VfsePopOver from "@src/components/common/presentational/vfsePopOver/VfsePopOver";
import { constants } from "@src/helpers/utils/constants";
import { hexToRgb } from "@src/helpers/utils/utils";
import { routes } from "@src/routes";
import "@src/components/shared/layout/mobileNavbar/mobileNavbar.scss";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import { routeItem } from "@src/types/interfaces";
const MobileNavbar = () => {
  const pathRoute = window.location.pathname;
  const [currentRoute, setCurrentRoute] = useState(pathRoute);
  const { organizationRoute } = constants;
  const selectedOrganization = useSelectedOrganization();
  const [vfseAnchorEl, setVfseAnchorEl] = useState<
    Element | ((element: Element) => Element)
  >(null);
  const { sideBarTextColor, buttonBackground, fontTwo } = useAppSelector(
    (state) => state.myTheme
  );
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
      .map((prop: routeItem, key) => {
        const splittedName = prop?.name.split(" ");
        return (
          <Fragment key={key}>
            {prop?.name !== "vFSE" ? (
              <ListItem
                button
                component={Link}
                to={`/${organizationRoute}/${selectedOrganization?.id}${prop.path}`}
                key={`listItem1-${key}`}
                className="MobileDrawerList"
                onClick={() =>
                  setCurrentRoute(
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                  )
                }
              >
                <ListItemIcon
                  key={`listItemIcon1-${key}`}
                  className="ListIcon"
                  style={
                    currentRoute ===
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                      ? {
                          color: "#fff",
                          borderRadius: "4px",
                          backgroundColor: hexToRgb(buttonBackground, 0.5),
                        }
                      : {
                          color: sideBarTextColor,
                          justifyContent: "center",
                        }
                  }
                >
                  <prop.icon />
                </ListItemIcon>
                <ListItemText
                  key={`listItemText1-${key}`}
                  primary={splittedName[0]}
                  style={
                    currentRoute ===
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                      ? {
                          color: "#fff",
                          textAlign: "center",
                          fontFamily: fontTwo,
                        }
                      : {
                          color: sideBarTextColor,
                          textAlign: "center",
                          fontFamily: fontTwo,
                        }
                  }
                />
              </ListItem>
            ) : (
              <ListItem
                button
                key={`listItem2-${key}`}
                className="MobileDrawerList"
                onClick={(e) => {
                  setCurrentRoute(
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                  );
                  setVfseAnchorEl(e.currentTarget);
                }}
              >
                <ListItemIcon
                  key={`listItemIcon2-${key}`}
                  className="ListIcon"
                  style={
                    currentRoute ===
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                      ? {
                          color: "#fff",
                          borderRadius: "4px",
                          backgroundColor: hexToRgb(buttonBackground, 0.5),
                        }
                      : {
                          color: sideBarTextColor,
                          justifyContent: "center",
                        }
                  }
                >
                  <prop.icon />
                </ListItemIcon>
                <ListItemText
                  key={`listItemText2-${key}`}
                  primary={splittedName[0]}
                  style={
                    currentRoute ===
                    `/${organizationRoute}/${selectedOrganization?.id}${prop.path}`
                      ? {
                          color: "#fff",
                          textAlign: "center",
                          fontFamily: fontTwo,
                        }
                      : {
                          color: sideBarTextColor,
                          textAlign: "center",
                          fontFamily: fontTwo,
                        }
                  }
                />
              </ListItem>
            )}
          </Fragment>
        );
      });

  return (
    <>
      <AppBar
        position="fixed"
        className="MobileNavbar"
        sx={{ top: "auto", bottom: 0, zIndex: 1000 }}
      >
        <Toolbar>
          <List style={{ position: "relative" }} className="mobile-content">
            {createLinks()}
            <ProfilePopOver
              profilePicture={me?.profile_picture}
              className="image"
            />
            <VfsePopOver
              anchorEl={vfseAnchorEl}
              setAnchorEl={setVfseAnchorEl}
            />
          </List>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MobileNavbar;
