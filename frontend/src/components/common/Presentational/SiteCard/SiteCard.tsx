import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import locationLogo from "@src/assets/images/locationIcon.svg";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { updateSitesService } from "@src/services/sitesService";
import {
  Organization,
  useOrganizationsSitesUpdateMutation,
} from "@src/store/reducers/api";

import "@src/components/common/Presentational/SiteCard/SiteCard.scss";

interface SiteCardProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOrganization: Dispatch<Organization>;
  row: object;
  refetch: () => void;
  siteId: number;
  name: string;
  machines: Array<string>;
  location: string;
  connections: number;
  sites: Array<object>;
}
const SiteCard = ({
  siteId,
  name,
  machines,
  location,
  connections,
  refetch,
  sites,
}: SiteCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { organizationRoute, networkRoute, sitesRoute, systemsRoute } =
    constants;
  const { cardPopUp } = localizedData().sites;
  const [deleteSite] = useOrganizationsSitesUpdateMutation();
  const { id, networkId } = useParams();

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
    const updatedSites = sites.filter((site) => site.id !== siteId);
    await updateSitesService(networkId, updatedSites, deleteSite, refetch);
    toast.success("Site successfully deleted");
  };
  return (
    <>
      <Link
        to={`/${organizationRoute}/${id}/${networkRoute}/${networkId}/${sitesRoute}/${siteId}/${systemsRoute}`}
        key={id}
        style={{ textDecoration: "none" }}
      >
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
                <MenuItem>
                  <span style={{ marginLeft: "12px" }}>
                    {cardPopUp?.editSite}
                  </span>
                </MenuItem>
                <MenuItem onClick={handleModalOpen}>
                  <span style={{ marginLeft: "12px" }}>
                    {cardPopUp?.deleteSite}
                  </span>
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
              ? machines?.slice(0, 3)?.map((item, index) => (
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
      </Link>
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
