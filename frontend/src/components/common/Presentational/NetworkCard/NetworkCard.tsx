import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import locationLogo from "@src/assets/images/locationIcon.svg";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/Presentational/NetworkCard/NetworkCard.scss";

interface NetworkCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<any>;
  row: object;
  refetch: any;
  networkId: number;
  logo: string;
  name: string;
  sitesCount: number;
}
const NetworkCard = ({
  networkId,
  logo,
  name,
  sitesCount,
}: NetworkCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { organizationRoute, networkRoute, sitesRoute } = constants;
  const constantData: any = localizedData()?.modalities;
  const { cardPopUp } = constantData;
  const open = Boolean(anchorEl);
  const { id } = useParams();

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
    <div className="NetworkCard">
      <Link
        to={`/${organizationRoute}/${id}/${networkRoute}/${networkId}/${sitesRoute}`}
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
          <div className="location-logo">
            <div className="location-logo__content">
              <img src={locationLogo} />
              <p className="text">{`${sitesCount} sites`}</p>
            </div>
          </div>
        </Box>
      </Link>
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
          className="Network-dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <span style={{ marginLeft: "12px" }}>{cardPopUp?.edit}</span>
          </MenuItem>
          <MenuItem onClick={handleModalOpen}>
            <span style={{ marginLeft: "12px" }}>{cardPopUp?.delete}</span>
          </MenuItem>
        </Menu>
      </div>
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
    </div>
  );
};

export default NetworkCard;
