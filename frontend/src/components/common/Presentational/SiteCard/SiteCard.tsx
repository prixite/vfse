import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import locationLogo from "@src/assets/images/locationIcon.svg";
import "@src/components/common/Presentational/SiteCard/SiteCard.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { localizedData } from "@src/helpers/utils/language";
interface SiteCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  refetch: any;
  id: number;
  name: string;
  machines: Array<String>;
  location: string;
  connections: number;
}
const SiteCard = ({ name, machines, location, connections }: SiteCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const constantData: any = localizedData()?.sites;
  const { cardPopUp } = constantData;

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
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              className="Site-dropdownMenu"
              onClose={handleClose}
            >
              <MenuItem>{cardPopUp?.editSite}</MenuItem>
              <MenuItem onClick={handleModalOpen}>
                {cardPopUp?.deleteSite}
              </MenuItem>
            </Menu>
          </div>
          <div className="location-logo">
            <div className="location-logo__content">
              <img src={locationLogo} />
              <p className="text">{location}</p>
            </div>
          </div>
        </div>
        <div className="machines-info">
          {machines && machines?.length
            ? machines?.map((item, index) => (
                <div key={index} className="text">
                  {item}
                </div>
              ))
            : ""}
        </div>
        <div className="connections">
          <div className="dot" />
          <span className="text">{`${connections} connections`}</span>
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
