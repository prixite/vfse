import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import "@src/components/common/Presentational/ClientCard/ClientCard.scss";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { constants } from "@src/helpers/utils/constants";
import { DeleteOrganizationService } from "@src/services/organizationService";
import { useAppDispatch } from "@src/store/hooks";
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
}
const ClientCard = ({
  id,
  logo,
  name,
  refetch,
  row,
  setOrganization,
  setAction,
}: ClientCardProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const { organizationRoute, networkRoute } = constants;

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
    handleClose();
  };

  const handleDeleteOrganization = async () => {
    handleModalClose();
    await DeleteOrganizationService(id, deleteOrganization, refetch);
    toast.success("Organization successfully deleted");
  };
  const handleUpdateSelectedOrganization = () => {
    dispatch(setSelectedOrganization({ selectedOrganization: row }));
    dispatch(updateSideBarColor(row.appearance.sidebar_color));
    dispatch(updateButtonColor(row.appearance.primary_color));
    dispatch(updateSideBarTextColor(row.appearance.sidebar_text));
    dispatch(updateButtonTextColor(row.appearance.button_text));
    dispatch(updateFontOne(row.appearance.font_one));
    dispatch(updateFontTwo(row.appearance.font_two));
    history.replace(`/${organizationRoute}/${id}/${networkRoute}`);
  };
  return (
    <div className="ClientCard">
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
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
      {/* <NewHealthNetwotkModal
          open={openNetworkModal}
          handleClose={handleNetworkModalClose}
        /> */}
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
          <MenuItem onClick={handleEditAppearance}>Edit appearance</MenuItem>
          <MenuItem onClick={handleNetworkModal}>
            Add new HealthNetwork
          </MenuItem>
          <MenuItem onClick={handleModalOpen} style={{ marginBottom: "0px" }}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ClientCard;
