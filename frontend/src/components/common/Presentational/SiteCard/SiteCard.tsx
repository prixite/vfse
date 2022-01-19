import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import locationLogo from "@src/assets/images/locationIcon.svg";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import SiteModal from "@src/components/shared/popUps/SiteModal/SiteModal";
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const { organizationRoute, networkRoute, sitesRoute, systemsRoute } =
    constants;
  const { cardPopUp } = localizedData().sites;
  const [updateSite] = useOrganizationsSitesUpdateMutation();
  const { id, networkId } = useParams();

  const selectionID =
    networkId == undefined ? id?.toString() : networkId?.toString();

  const open = Boolean(anchorEl);
  const handleDeleteModalOpen = () => {
    setOpenModal(true);
    handleClose();
  };
  const handleEditModalOpen = () => {
    setOpenEditModal(true);
    handleClose();
  };
  const handleEditModalClose = () => {
    setOpenEditModal(false);
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
    const updatedSites = sites.filter((site) => site?.id !== siteId);
    await updateSitesService(
      selectionID,
      updatedSites,
      updateSite,
      refetch,
      "delete"
    );
  };
  return (
    <div className="SiteCard">
      <Link
        to={
          networkId == undefined
            ? `/${organizationRoute}/${id}/${sitesRoute}/${siteId}/${systemsRoute}`
            : `/${organizationRoute}/${id}/${networkRoute}/${networkId}/${sitesRoute}/${siteId}/${systemsRoute}`
        }
        key={id}
        style={{ textDecoration: "none", height: "100%" }}
      >
        <Box component="div" style={{ height: "100%" }}>
          <div className="SiteCard__Header">
            <h3 className="ClientName">{name}</h3>
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
          <MenuItem onClick={handleEditModalOpen}>
            <span style={{ marginLeft: "12px" }}>{cardPopUp?.editSite}</span>
          </MenuItem>
          <MenuItem onClick={handleDeleteModalOpen}>
            <span style={{ marginLeft: "12px" }}>{cardPopUp?.deleteSite}</span>
          </MenuItem>
        </Menu>
      </div>
      <SiteModal
        open={openEditModal}
        siteId={siteId}
        address={location}
        name={name}
        sites={sites}
        action={"edit"}
        selectionID={selectionID}
        handleClose={handleEditModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default SiteCard;
