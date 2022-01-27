import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  InputAdornment,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

import Machine from "@src/assets/images/system.png";
import AttachmentIcon from "@src/assets/svgs/attachment.svg";
import CopyIcon from "@src/assets/svgs/copy-icon.svg";
import ConfirmationModal from "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal";
import { SystemInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import { DeleteOrganizationSystemService } from "@src/services/systemServices";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSystemsDeleteMutation } from "@src/store/reducers/api";

import "@src/components/common/Presentational/SystemCard/SystemCard.scss";

const SystemCard = ({ system, handleEdit, refetch }: SystemInterface) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const [deleteSystem] = useOrganizationsSystemsDeleteMutation();
  const open = Boolean(anchorEl);
  const {
    his_ris_info_txt,
    dicom_info_txt,
    serial_txt,
    asset_txt,
    helium_level,
    mpc_status,
    copy_btn,
    ip_address_txt,
    local_ae_title_txt,
    software_version_txt,
    location,
    connect,
    grafana_link_txt,
  } = localizedData().systems_card;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setModal(false);
    await DeleteOrganizationSystemService(
      selectedOrganization.id,
      system.id,
      deleteSystem,
      refetch
    );
    handleClose();
  };

  return (
    <div className="system-card">
      <Box className="container">
        <div className="machine">
          <p className="name">{system.name}</p>
          <img
            className="image"
            src={system.image_url == "" ? Machine : system.image_url}
          />
          <div className="btn-section">
            <Button
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              className="connect-btn"
            >
              {connect}
            </Button>
            <Button
              variant="contained"
              className="link-btn"
              onClick={() => window?.open(system.grafana_link, "_blank")}
            >
              <div className="btn-content">
                <img src={AttachmentIcon} className="icon" />
                <span>{grafana_link_txt}</span>
              </div>
            </Button>
          </div>
        </div>
        <div className="features-section">
          <div className="features">
            <div style={{ marginRight: "32px" }}>
              <p className="option">
                {his_ris_info_txt} <br />
                <strong>{system.his_ris_info?.title}</strong>
              </p>
              <p className="option">
                {dicom_info_txt} <br />
                <strong>{system.dicom_info?.title}</strong>
              </p>
              <p className="option">
                {serial_txt} <br />
                <strong>{system.serial_number}</strong>
              </p>
            </div>
            <div>
              <p className="option">
                {asset_txt} <br />
                <strong>{system.asset_number}</strong>
              </p>
              <p className="option">
                {helium_level} <br />
                <strong>{system.mri_embedded_parameters?.helium}</strong>
              </p>
              <p className="option">
                {mpc_status} <br />
                <strong>
                  {system.mri_embedded_parameters?.magnet_pressure}
                </strong>
              </p>
            </div>
          </div>
          <TextField
            className="copy-field"
            variant="outlined"
            value={system.documentation}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={CopyIcon} className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Button
                    className="copy-btn"
                    onClick={() => {
                      navigator?.clipboard?.writeText(system.documentation);
                      toast.success("Link Copied.", {
                        autoClose: 1000,
                        pauseOnHover: false,
                      });
                    }}
                  >
                    {copy_btn}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="info-section">
          <p className="option">
            {ip_address_txt} <br />
            <strong>{system.ip_address}</strong>
          </p>
          <p className="option">
            {local_ae_title_txt} <br />
            <strong>{system.local_ae_title}</strong>
          </p>
          <p className="option">
            {software_version_txt} <br />
            <strong>{system.software_version}</strong>
          </p>
          <p className="option">
            {location} <br />
            <strong>{system.location_in_building}</strong>
          </p>
        </div>
      </Box>
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
          className="system-dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={handleEdit}>
            <span style={{ marginLeft: "12px" }}>Edit</span>
          </MenuItem>
          <MenuItem onClick={() => setModal(true)}>
            <span style={{ marginLeft: "12px" }}>Delete</span>
          </MenuItem>
        </Menu>
      </div>
      <ConfirmationModal
        name={system.name}
        open={modal}
        handleClose={() => setModal(false)}
        handleDeleteOrganization={handleDelete}
      />
    </div>
  );
};

export default SystemCard;
