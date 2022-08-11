import * as React from "react";

import Popover from "@mui/material/Popover";
import { useNavigate } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
} from "@src/store/reducers/themeStore";
import "@src/components/common/presentational/profilePopOver/profilePopOver.scss";

interface Props {
  profilePicture: string;
  className: string;
}

const ProfilePopOver = ({ profilePicture, className }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const defaultOrganizationData = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const selectedOrganizationData = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { organizationRoute } = constants;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setDefaultOrganization = (e) => {
    e.preventDefault();
    dispatch(
      setSelectedOrganization({ selectedOrganization: defaultOrganizationData })
    );
    dispatch(
      updateSideBarColor(defaultOrganizationData.appearance.sidebar_color)
    );
    dispatch(
      updateButtonColor(defaultOrganizationData.appearance.primary_color)
    );
    dispatch(
      updateSideBarTextColor(defaultOrganizationData.appearance.sidebar_text)
    );
    dispatch(
      updateButtonTextColor(defaultOrganizationData.appearance.button_text)
    );
    handleClose();
    navigate(`/${organizationRoute}/${defaultOrganizationData.id}/`, {
      replace: true,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <img src={profilePicture} className={className} onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{ marginLeft: "5px" }}
        className="ProfilePopOver"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div
          className="ProfilePopOver__header"
          style={{ padding: "8px 8px 4px 8px", cursor: "pointer" }}
        >
          <p>{selectedOrganizationData?.name}</p>
        </div>
        <div
          className="profile-item"
          style={{ padding: "8px 8px 4px 8px", cursor: "pointer" }}
        >
          {" "}
          <a
            style={{ textDecoration: "none" }}
            onClick={(e) => setDefaultOrganization(e)}
          >
            Default Organization
          </a>
        </div>
        <div
          onClick={() => (location.href = "/accounts/logout/")}
          className="profile-item"
          style={{ padding: "4px 8px 8px 8px", cursor: "pointer" }}
        >
          {" "}
          <a style={{ textDecoration: "none" }}>Logout</a>
        </div>
      </Popover>
    </div>
  );
};

export default ProfilePopOver;
