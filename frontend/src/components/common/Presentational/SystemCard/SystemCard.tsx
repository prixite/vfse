import { Box, InputAdornment, TextField, Button } from "@mui/material";

import Machine from "@src/assets/images/system.png";
import AttachmentIcon from "@src/assets/svgs/attachment.svg";
import CopyIcon from "@src/assets/svgs/copy-icon.svg";
import { SystemInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Presentational/SystemCard/SystemCard.scss";

const SystemCard = ({
  name,
  image,
  his_ris_info,
  dicom_info,
  serial_number,
  asset_number,
  mri_embedded_parameters,
  ip_address,
  local_ae_title,
  software_version,
  location_in_building,
  grafana_link,
  documentation,
}: SystemInterface) => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

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

  return (
    <Box className="system-card">
      <div className="machine">
        <p className="name">{name}</p>
        <img src={image == "" ? Machine : image} />
      </div>
      <div className="features-section">
        <div className="features">
          <div style={{ marginRight: "32px" }}>
            <p className="option">
              {his_ris_info_txt} <strong>{his_ris_info?.title}</strong>
            </p>
            <p className="option">
              {dicom_info_txt} <strong>{dicom_info?.title}</strong>
            </p>
            <p className="option">
              {serial_txt} <strong>{serial_number}</strong>
            </p>
          </div>
          <div>
            <p className="option">
              {asset_txt} <strong>{asset_number}</strong>
            </p>
            <p className="option">
              {helium_level} <strong>{mri_embedded_parameters?.helium}</strong>
            </p>
            <p className="option">
              {mpc_status}{" "}
              <strong>{mri_embedded_parameters?.magent_pressure}</strong>
            </p>
          </div>
        </div>
        <TextField
          className="copy-field"
          variant="outlined"
          value={documentation}
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
                  onClick={() => navigator?.clipboard?.writeText(documentation)}
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
          {ip_address_txt} <strong>{ip_address}</strong>
        </p>
        <p className="option">
          {local_ae_title_txt} <strong>{local_ae_title}</strong>
        </p>
        <p className="option">
          {software_version_txt} <strong>{software_version}</strong>
        </p>
        <p className="option">
          {location} <strong>{location_in_building}</strong>
        </p>
      </div>
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
          onClick={() => window?.open(grafana_link, "_blank")}
        >
          <div className="btn-content">
            <img src={AttachmentIcon} className="icon" />
            <span>{grafana_link_txt}</span>
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default SystemCard;
