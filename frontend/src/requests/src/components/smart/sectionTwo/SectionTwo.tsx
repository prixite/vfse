import React from "react";

import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import "@src/requests/src/components/smart/sectionTwo/sectionTwo.scss";
import Permissions from "@src/requests/src/components/presentational/permissions/Permissions";
// import { HealthNetwork, Modality, Site } from "@src/store/reducers/generated";
import {
  HealthNetwork,
  Modality,
  Site,
} from "@src/store/reducers/generatedWrapper";
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
  modalitiesList: Modality[];
  selectedSites: unknown[];
  setSelectedSites: React.Dispatch<React.SetStateAction<unknown[]>>;
  selectedModalities: unknown[];
  setSelectedModalities: React.Dispatch<React.SetStateAction<unknown[]>>;
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
  modalitiesList,
  selectedSites,
  setSelectedSites,
  selectedModalities,
  setSelectedModalities,
}: SectionTwoProps) => {
  const handleSitesSelection = (e) => {
    const val = parseInt(e.target.value);
    if (selectedSites.indexOf(val) > -1) {
      selectedSites?.splice(selectedSites?.indexOf(val), 1);
      setSelectedSites([...selectedSites]);
    } else {
      setSelectedSites([...selectedSites, parseInt(e.target.value)]);
    }
  };

  const handleSelectedModalities = (event, newFormats) => {
    setSelectedModalities(newFormats);
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
      <div>
        {modalitiesList?.length ? (
          <p className="modalities-header">
            <span className="info-label">Access to modalities</span>
            <span className="checked-ratio">{`${selectedModalities?.length}/${modalitiesList?.length}`}</span>
          </p>
        ) : (
          ""
        )}
        <ToggleButtonGroup
          value={selectedModalities}
          color="primary"
          onChange={handleSelectedModalities}
          aria-label="text formatting"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {modalitiesList?.length &&
            modalitiesList?.map((item, key) => (
              <ToggleButton key={key} value={item?.id} className="toggle-btn">
                {item?.name}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </div>
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
