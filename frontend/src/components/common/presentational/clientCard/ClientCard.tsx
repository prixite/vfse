import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "@src/components/common/presentational/clientCard/clientCard.scss";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { returnPayloadThemeObject } from "@src/helpers/utils/utils";
import { DeleteOrganizationService } from "@src/services/organizationService";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  Organization,
  useOrganizationsDeleteMutation,
} from "@src/store/reducers/api";
import { openAddModal } from "@src/store/reducers/appStore";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import {
  updateTheme
} from "@src/store/reducers/themeStore";

interface ClientCardProps {
  setOrganization: Dispatch<SetStateAction<Organization>>;
  row: Organization;
  id: number;
  logo: string;
  name: string;
  setAction: Dispatch<SetStateAction<string>>;
  selected: boolean;
  superuser: boolean;
}
const ClientCard = ({
  id,
  logo,
  name,
  row,
  setOrganization,
  setAction,
  selected,
  superuser,
}: ClientCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hoverColor, setHoverColor] = useState("transparent");
  const open = Boolean(anchorEl);
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const defaultOrganizationData = useAppSelector(
    (state) => state.organization.currentOrganization
  );
  const { organizationRoute, networkRoute } = constants;

  const { buttonBackground } = useAppSelector((state) => state.myTheme);

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
    await DeleteOrganizationService(id, deleteOrganization);
    toast.success("Organization successfully deleted", {
      autoClose: 1000,
      pauseOnHover: false,
    });
    if (selected) {
      switchOrganization(defaultOrganizationData);
    }
  };
  const handleUpdateSelectedOrganization = () => {
    if (superuser) {
      const themeObj = returnPayloadThemeObject(row);
      dispatch(setSelectedOrganization({ selectedOrganization: row }));
      dispatch(updateTheme(themeObj)),
      navigate(`/${organizationRoute}/${id}/${networkRoute}/`, {
        replace: true,
      });
    }
  };
  const switchOrganization = async(org) => {
    const themeObj = returnPayloadThemeObject(org);
    await Promise.all([
      dispatch(setSelectedOrganization({ selectedOrganization: org })),
      dispatch(updateTheme(themeObj)),
      navigate(`/${organizationRoute}/${org?.id}/`, { replace: true }),
    ]);
  };

  return (
    <div className="ClientCard">
      <Box
        style={{
          outline: `${selected ? `2px solid ${buttonBackground}` : ""}`,
          outlineOffset: `${selected ? "-2px" : ""}`,
        }}
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
      <Button
        style={{
          borderColor: buttonBackground,
          color: "black",
          backgroundColor: hoverColor,
        }}
        onClick={() => switchOrganization(row)}
        onMouseOver={() => setHoverColor(buttonBackground)}
        onMouseLeave={() => setHoverColor("transparent")}
        className="add-btn"
        size="small"
        variant="outlined"
      >
        {switch_org}
      </Button>
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
      {superuser ? (
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
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientCard;
