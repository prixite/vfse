import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import locationLogo from "@src/assets/images/locationIcon.svg";
import "@src/components/common/Presentational/NetworkCard/NetworkCard.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";

interface NetworkCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  refetch: any;
  id: number;
  logo: string;
  name: string;
}
const NetworkCard = ({ logo, name }: NetworkCardProps) => {
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

  const handleDeleteOrganization = async () => {
    handleModalClose();
    toast.success("Network successfully deleted");
  };
  return (
    <>
      <Box component="div" className="NetworkCard">
        <div className="NetworkCard__Header">
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
              className="Network-dropdownMenu"
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <span style={{ marginLeft: "12px" }}>Edit</span>
              </MenuItem>
              <MenuItem onClick={handleModalOpen}>
                <span style={{ marginLeft: "12px" }}>Delete</span>
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="NetworkCard__Logo">
          <img src={logo} />
        </div>
        <div className="location-logo">
          <div className="location-logo__content">
            <img src={locationLogo} />
            <p className="text">16 sites</p>
          </div>
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

export default NetworkCard;
