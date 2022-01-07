import { Box, InputAdornment, TextField, Button } from "@mui/material";

import Machine from "@src/assets/images/system.png";
import AttachmentIcon from "@src/assets/svgs/attachment.svg";
import CopyIcon from "@src/assets/svgs/copy-icon.svg";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Presentational/SystemCard/SystemCard.scss";

const SystemCard = () => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <Box className="system-card">
      <div className="machine">
        <p className="name">Ge Signa Excite</p>
        <img src={Machine} />
      </div>
      <div className="features-section">
        <div className="features">
          <div style={{ marginRight: "32px" }}>
            <p className="option">
              HIS/RIS info <strong>Default</strong>
            </p>
            <p className="option">
              Dicom info <strong>Default</strong>
            </p>
            <p className="option">
              Serial <strong>386917MR</strong>
            </p>
          </div>
          <div>
            <p className="option">
              Asset <strong>45631-1319225</strong>
            </p>
            <p className="option">
              Helium level <strong>56</strong>
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
          IP address <strong>168.0.0.1</strong>
        </p>
        <p className="option">
          Local AE title <strong>Default</strong>
        </p>
        <p className="option">
          Software Version <strong>10.5</strong>
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
