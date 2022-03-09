import React, { useState } from "react";

import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

import "@src/requests/src/components/Smart/SectionTwo/SectionTwo.scss";
import Permissions from "@src/requests/src/components/Presentational/Permissions/Permissions";
import { HealthNetwork, Site } from "@src/store/reducers/generated";
interface SectionTwoProps {
  docLink: boolean;
  setDocLink: React.Dispatch<React.SetStateAction<boolean>>;
  possibilitytoLeave: boolean;
  setPossibilitytoLeave: React.Dispatch<React.SetStateAction<boolean>>;
  accessToFSEFunctions: boolean;
  setAccessToFSEFunctions: React.Dispatch<React.SetStateAction<boolean>>;
  viewOnly: boolean;
  setViewOnly: React.Dispatch<React.SetStateAction<boolean>>;
  auditEnable: boolean;
  setAuditEnable: React.Dispatch<React.SetStateAction<boolean>>;
  oneTimeLinkCreation: boolean;
  setOneTimeLinkCreation: React.Dispatch<React.SetStateAction<boolean>>;
  organizationSites: Site[];
  HealthNetworks: HealthNetwork[];
}
const SectionTwo = ({
  docLink,
  setDocLink,
  possibilitytoLeave,
  setPossibilitytoLeave,
  accessToFSEFunctions,
  setAccessToFSEFunctions,
  viewOnly,
  setViewOnly,
  auditEnable,
  setAuditEnable,
  oneTimeLinkCreation,
  setOneTimeLinkCreation,
  organizationSites,
  HealthNetworks,
}: SectionTwoProps) => {
  const [selectedSites, setSelectedSites] = useState([]);
  const handleSitesSelection = (e) => {
    const val = parseInt(e.target.value);
    if (selectedSites.indexOf(val) > -1) {
      selectedSites?.splice(selectedSites?.indexOf(val), 1);
      setSelectedSites([...selectedSites]);
    } else {
      setSelectedSites([...selectedSites, parseInt(e.target.value)]);
    }
  };
  const sitesLength = () => {
    let count = 0;
    HealthNetworks?.forEach((item) => {
      if (item?.sites?.length) {
        count += item?.sites?.length;
      }
    });
    if (organizationSites && organizationSites.length) {
      count += organizationSites?.length;
    }
    return count;
  };

  return (
    <Box component="div" className="SectionTwo">
      {sitesLength() > 0 ? (
        <p className="modalities-header">
          <span className="info-label">Health Network Access</span>
          <span className="checked-ratio">{`${
            selectedSites?.length
          }/${sitesLength()}`}</span>
        </p>
      ) : (
        ""
      )}
      {HealthNetworks?.map((item, key) =>
        item?.sites?.length ? (
          <div key={key}>
            <details className="network-details">
              <summary className="header" style={{ cursor: "pointer" }}>
                <span className="title">{item?.name}</span>
              </summary>
              {item?.sites?.map((site, key) => (
                <FormGroup
                  key={key}
                  style={{ marginLeft: "20px" }}
                  className="options"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleSitesSelection}
                        checked={selectedSites.includes(site?.id)}
                        value={site?.id}
                        name={site?.address}
                        color="primary"
                      />
                    }
                    label={site?.address}
                  />
                </FormGroup>
              ))}
            </details>
          </div>
        ) : (
          ""
        )
      )}
      {organizationSites && organizationSites?.length ? (
        <div className="network-details">
          {organizationSites?.map((site, key) => (
            <FormGroup
              key={key}
              style={{ marginLeft: "20px" }}
              className="options"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleSitesSelection}
                    checked={selectedSites.includes(site?.id)}
                    value={site?.id}
                    name={site?.address}
                    color="primary"
                  />
                }
                label={site?.address}
              />
            </FormGroup>
          ))}
        </div>
      ) : (
        ""
      )}
      <Permissions
        docLink={docLink}
        setDocLink={setDocLink}
        possibilitytoLeave={possibilitytoLeave}
        setPossibilitytoLeave={setPossibilitytoLeave}
        accessToFSEFunctions={accessToFSEFunctions}
        setAccessToFSEFunctions={setAccessToFSEFunctions}
        viewOnly={viewOnly}
        setViewOnly={setViewOnly}
        auditEnable={auditEnable}
        setAuditEnable={setAuditEnable}
        oneTimeLinkCreation={oneTimeLinkCreation}
        setOneTimeLinkCreation={setOneTimeLinkCreation}
      />
    </Box>
  );
};

export default SectionTwo;
