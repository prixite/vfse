import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import locationLogo from "@src/assets/images/locationIcon.svg";
import "@src/components/common/Presentational/SiteCard/SiteCard.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
interface ClientCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  refetch: any;
  id: number;
  name: string;
  machines: Array,
  location: string,
  connections: number,
}
const SiteCard = ({
  name,
  machines,
  location,
  connections,
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

  const handleDeleteOrganization = async () => {
    handleModalClose();
    toast.success("Organization successfully deleted");
  };
  return (
    <>
      <Box component="div" className="SiteCard">
        <div className="SiteCard__Header">
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
              className="Site-dropdownMenu"
              onClose={handleClose}
            >
              <MenuItem>
                Edit
              </MenuItem>
              <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
            </Menu>
          </div>
          <div className="location-logo">
            <div className="location-logo__content">
              <img src={locationLogo} />
              <p className="text">{location}</p>
            </div>
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

export default SiteCard;
