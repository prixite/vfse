import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import "@src/components/common/Presentational/ClientCard/ClientCard.scss";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { DeleteOrganizationService } from "@src/services/organizationService";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  Organization,
  useOrganizationsDeleteMutation,
} from "@src/store/reducers/api";
import { openAddModal } from "@src/store/reducers/appStore";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import {
  updateButtonColor,
  updateSideBarColor,
  updateButtonTextColor,
  updateSideBarTextColor,
  updateSecondaryColor,
  updateFontOne,
  updateFontTwo,
} from "@src/store/reducers/themeStore";

interface ClientCardProps {
  setOrganization: Dispatch<SetStateAction<Organization>>;
  row: Organization;
  refetch: () => void;
  id: number;
  logo: string;
  name: string;
  setAction: Dispatch<SetStateAction<string>>;
  selected: boolean;
}
const ClientCard = ({
  id,
  logo,
  name,
  refetch,
  row,
  setOrganization,
  setAction,
  selected,
}: ClientCardProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const { organizationRoute, networkRoute } = constants;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { switch_org, edit, new_network, delete_org } =
    localizedData().organization_menu_options;

  const handleModalOpen = () => {
    setOpenModal(true);
    handleClose();
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  //const handleNetworkModalClose = () => setOpenNetworkModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditAppearance = () => {
    setAction("edit");
    dispatch(openAddModal());
    setOrganization(row);
    handleClose();
  };
  const handleNetworkModal = () => {
    setAction("new");
    dispatch(openAddModal());
    setOrganization(row);
    handleClose();
  };

  const handleDeleteOrganization = async () => {
    handleModalClose();
    await DeleteOrganizationService(id, deleteOrganization, refetch);
    toast.success("Organization successfully deleted", {
      autoClose: 1000,
      pauseOnHover: false,
    });
  };
  const handleUpdateSelectedOrganization = () => {
    dispatch(setSelectedOrganization({ selectedOrganization: row }));
    dispatch(updateSideBarColor(row.appearance.sidebar_color));
    dispatch(updateButtonColor(row.appearance.primary_color));
    dispatch(updateSideBarTextColor(row.appearance.sidebar_text));
    dispatch(updateButtonTextColor(row.appearance.button_text));
    dispatch(updateSecondaryColor(row.appearance.secondary_color));
    dispatch(updateFontOne(row.appearance.font_one));
    dispatch(updateFontTwo(row.appearance.font_two));
    history.replace(`/${organizationRoute}/${id}/${networkRoute}`);
  };
  const switchOrganization = () => {
    dispatch(setSelectedOrganization({ selectedOrganization: row }));
    history.replace(`/${organizationRoute}/${id}/`);
    handleClose();
  };
  return (
    <div
      className="ClientCard"
      style={{ border: `${selected ? `3px solid ${buttonBackground}` : ""}` }}
    >
      <Box
        component="div"
        className="card"
        onClick={handleUpdateSelectedOrganization}
      >
        <div className="card__Header">
          <h3 className="ClientName">{name}</h3>
        </div>
        <div className="card__Logo">
          <img src={logo} />
        </div>
      </Box>
      <div
        className="location-logo"
        onClick={switchOrganization}
        style={{ backgroundColor: buttonBackground }}
      >
        <div className="location-logo__content">
          <p className="text" style={{ color: buttonTextColor }}>
            {switch_org}
          </p>
        </div>
      </div>
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
      <div className="dropdownIcon">
        <MoreVertIcon
          id="client-options-button"
          className="dropdown"
          onClick={handleClick}
        />
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="client-options-button"
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={handleEditAppearance}>{edit}</MenuItem>
          <MenuItem onClick={handleNetworkModal}>{new_network}</MenuItem>
          <MenuItem onClick={handleModalOpen} style={{ marginBottom: "0px" }}>
            {delete_org}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ClientCard;
