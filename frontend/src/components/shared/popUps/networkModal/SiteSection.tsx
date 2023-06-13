import { Dispatch, SetStateAction, useState, useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { TextField, InputAdornment } from "@mui/material";

import LocationIcon from "@src/assets/svgs/location.svg";
import { Site } from "@src/store/reducers/api";

interface SiteSectionProps {
  sitee: Site;
  index: number;
  setSites: (args: Site[]) => void;
  AllSites: Site[];
  setIsSiteDataPartiallyFilled: Dispatch<SetStateAction<boolean>>;
  isSiteDataPartiallyFilled: boolean;
}

const SiteSection = ({
  sitee,
  setSites,
  index,
  AllSites,
  isSiteDataPartiallyFilled,
  setIsSiteDataPartiallyFilled,
}: SiteSectionProps) => {
  const [siteName, setSiteName] = useState("");
  const [siteNameErr, setSiteNameErr] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [siteAddressErr, setSiteAddressErr] = useState("");

  useEffect(() => {
    if (sitee) {
      setSiteName(sitee?.name);
      setSiteAddress(sitee?.address);
    }
  }, [sitee]);

  useEffect(() => {
    if (isSiteDataPartiallyFilled) {
      if (sitee?.name === "" && sitee?.address !== "") {
        setSiteAddressErr("");
        setSiteNameErr("Name is required");
      }
      if (sitee?.name !== "" && sitee?.address === "") {
        setSiteAddressErr("Location is required");
        setSiteNameErr("");
      }
      if (
        (sitee?.name === "" && sitee?.address === "") ||
        (sitee?.name && sitee?.address)
      ) {
        setSiteAddressErr("");
        setSiteNameErr("");
      }
    }
    setIsSiteDataPartiallyFilled(false);
  }, [isSiteDataPartiallyFilled]);
  const SiteNameHandler = (event) => {
    const tempSites = [...AllSites];
    const siteData = tempSites[index];
    tempSites[index] = { ...siteData, name: event.target.value };
    setSiteName(event.target.value);
    setSiteNameErr("");
    setSites([...tempSites]);
  };
  const SiteLocationHandler = (event) => {
    const tempSites = [...AllSites];
    const siteData = tempSites[index];
    tempSites[index] = { ...siteData, address: event.target.value };
    setSiteAddress(event.target.value);
    setSiteAddressErr("");
    setSites([...tempSites]);
  };
  const deleteSiteCardHandler = () => {
    const tempSites = AllSites.filter((_, ind) => index !== ind);
    setSites([...tempSites]);
  };

  return (
    <>
      <div
        className="SiteSection"
        style={index === 0 ? {} : { marginTop: "15px" }}
      >
        <CloseIcon className="close-icon" onClick={deleteSiteCardHandler} />
        <div className="network-info">
          <p className="info-label">{`${"Site Name #"}${index + 1}`}</p>
          <TextField
            className="info-field"
            variant="outlined"
            placeholder="Enter name here"
            value={siteName}
            onChange={SiteNameHandler}
          />
          <p className="errorText">{siteNameErr}</p>
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
            value={siteAddress}
            onChange={SiteLocationHandler}
          />
          <p className="errorText">{siteAddressErr}</p>
        </div>
      </div>
    </>
  );
};

export default SiteSection;
