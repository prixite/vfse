import { Dispatch, SetStateAction } from "react";

import { TextField, InputAdornment } from "@mui/material";

import LocationIcon from "@src/assets/svgs/location.svg";
import { localizedData } from "@src/helpers/utils/language";
import { Site } from "@src/store/reducers/api";

interface SiteSectionProps {
  sitee: Site;
  index: number;
  setSites: Dispatch<SetStateAction<Site[]>>;
  AllSites: Site[];
}

const SiteSection = ({
  sitee,
  setSites,
  index,
  AllSites,
}: SiteSectionProps) => {
  const constantData: object = localizedData()?.siteSection;
  const { site } = constantData;

  const SiteNameHandler = (event) => {
    const tempSites = [...AllSites];
    const { address } = tempSites[index];
    tempSites[index] = { name: event.target.value, address };
    setSites([...tempSites]);
  };
  const SiteLocationHandler = (event) => {
    const tempSites = [...AllSites];
    const { name } = tempSites[index];
    tempSites[index] = { name, address: event.target.value };
    setSites([...tempSites]);
  };
  return (
    <>
      <div className="network-info">
        <p className="info-label">{`${site}${index + 1}`}</p>
        <TextField
          className="info-field"
          variant="outlined"
          placeholder="Enter name here"
          value={sitee?.name}
          onChange={SiteNameHandler}
        />
      </div>
      <div className="network-info">
        <TextField
          className="info-field location"
          variant="outlined"
          placeholder={`Enter Site #${index + 1} location here`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={LocationIcon} className="location-icon" />
              </InputAdornment>
            ),
          }}
          value={sitee?.address}
          onChange={SiteLocationHandler}
        />
      </div>
    </>
  );
};

export default SiteSection;
