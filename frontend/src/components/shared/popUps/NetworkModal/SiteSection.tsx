import { TextField, InputAdornment } from "@mui/material";

import LocationIcon from "@src/assets/svgs/location.svg";
import { localizedData } from "@src/helpers/utils/language";

interface SiteSectionProps {
  siteNumber: number;
}

const SiteSection = ({ siteNumber }: SiteSectionProps) => {
  const constantData: object = localizedData()?.siteSection;
  const { site } = constantData;

  return (
    <>
      <div className="network-info">
        <p className="info-label">{`${site}${siteNumber}`}</p>
        <TextField
          className="info-field"
          variant="outlined"
          placeholder="Enter name here"
        />
      </div>
      <div className="network-info">
        <TextField
          className="info-field location"
          variant="outlined"
          placeholder={`Enter Site #${siteNumber} location here`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={LocationIcon} className="location-icon" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
};

export default SiteSection;
