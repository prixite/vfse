import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import "@src/components/common/Presentational/ClientCard/ClientCard.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "@src/components/common/Smart/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
interface ClientCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  deleteOrganization: any;
  refetch: any;
  id: number;
  logo: string;
  name: string;
}
const ClientCard = ({
  id,
  logo,
  name,
  deleteOrganization,
  refetch,
  row,
  setOpen,
  setOrganization,
}: ClientCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
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
    await deleteOrganization({
      id: id.toString(),
    }).unwrap();
    toast.success("Organization successfully deleted");
    refetch();
  };
  return (
    <>
      <Box component="div" className="ClientCard">
        <div className="ClientCard__Header">
          <h3 className="ClientName">{name}</h3>
          <div>
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
              <MenuItem onClick={handleEditAppearance}>
                Edit appearance
              </MenuItem>
              <MenuItem onClick={handleClose}>Add new HealthNetwork</MenuItem>
              <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="ClientCard__Logo">
          <img src={logo} />
        </div>
      </Box>
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
    </>
  );
};

export default ClientCard;
