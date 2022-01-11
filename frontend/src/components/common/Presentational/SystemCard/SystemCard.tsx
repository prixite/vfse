import { Box, InputAdornment, TextField, Button } from "@mui/material";

import Machine from "@src/assets/images/system.png";
import AttachmentIcon from "@src/assets/svgs/attachment.svg";
import CopyIcon from "@src/assets/svgs/copy-icon.svg";
import { SystemInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Presentational/SystemCard/SystemCard.scss";

const SystemCard = ({
  name,
  his_ris_info,
  dicom_info,
  asset_number,
  mri_embedded_parameters,
  ip_address,
  local_ae_title,
  software_version,
}: SystemInterface) => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <Box className="system-card">
      <div className="machine">
        <p className="name">{name}</p>
        <img src={Machine} />
      </div>
      <div className="features-section">
        <div className="features">
          <div style={{ marginRight: "32px" }}>
            <p className="option">
              HIS/RIS info <strong>{his_ris_info?.title}</strong>
            </p>
            <p className="option">
              Dicom info <strong>{dicom_info?.title}</strong>
            </p>
            <p className="option">
              Serial <strong>386917MR</strong>
            </p>
          </div>
          <div>
            <p className="option">
              Asset <strong>{asset_number}</strong>
            </p>
            <p className="option">
              Helium level <strong>{mri_embedded_parameters?.helium}</strong>
            </p>
            <p className="option">
              MPC Status <strong>67</strong>
            </p>
          </div>
        </div>
        <TextField
          className="copy-field"
          variant="outlined"
          value="www.doclink.com/er"
          // placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={CopyIcon} className="icon" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <Button className="copy-btn">Copy</Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="info-section">
        <p className="option">
          IP address <strong>{ip_address}</strong>
        </p>
        <p className="option">
          Local AE title <strong>{local_ae_title}</strong>
        </p>
        <p className="option">
          Software Version <strong>{software_version}</strong>
        </p>
        <p className="option">
          Location <strong>Name</strong>
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
          Connect
        </Button>
        <Button
          variant="contained"
          className="link-btn"
          // disabled={!actualData?.length}
        >
          <div className="btn-content">
            <img src={AttachmentIcon} className="icon" />
            <span>Grafana Link</span>
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default SystemCard;
