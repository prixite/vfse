import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import "@src/components/common/Presentational/ClientCard/ClientCard.scss";
import { useOrganizationsDeleteMutation } from "@src/store/reducers/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { constants } from "@src/helpers/utils/constants";
import { DeleteOrganizationService } from "@src/services/organizationService";

interface ClientCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  refetch: any;
  id: number;
  logo: string;
  name: string;
}
const ClientCard = ({
  id,
  logo,
  name,
  refetch,
  row,
  setOpen,
  setOrganization,
}: ClientCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const { organizationRoute } = constants;

  const handleModalOpen = () => {
    setOpenModal(true);
    handleClose();
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditAppearance = () => {
    setOpen(true);
    setOrganization(row);
  };

  const handleDeleteOrganization = async () => {
    handleModalClose();
    await DeleteOrganizationService(id, deleteOrganization, refetch);
    toast.success("Organization successfully deleted");
  };
  return (
    <div className="ClientCard">
      <Link
        to={`/${organizationRoute}/${id}`}
        key={id}
        style={{ textDecoration: "none" }}
      >
        <Box component="div" className="card">
          <div className="card__Header">
            <h3 className="ClientName">{name}</h3>
          </div>
          <div className="card__Logo">
            <img src={logo} />
          </div>
        </Box>
      </Link>
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
          className="dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={handleEditAppearance}>Edit appearance</MenuItem>
          <MenuItem onClick={handleClose}>Add new HealthNetwork</MenuItem>
          <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ClientCard;
