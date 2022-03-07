import React from "react";

import { Box } from "@mui/material";

import "@src/requests/src/components/Smart/SectionTwo/SectionTwo.scss";
import Permissions from "@src/requests/src/components/Presentational/Permissions/Permissions";
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
}: SectionTwoProps) => {
  return (
    <Box component="div" className="SectionTwo">
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
