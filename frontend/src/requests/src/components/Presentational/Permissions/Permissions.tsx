import "@src/requests/src/components/presentational/permissions/permissions.scss";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

interface PermissionsProps {
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
const Permissions = ({
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
}: PermissionsProps) => {
  return (
    <details className="Permission-details">
      <summary className="header" style={{ cursor: "pointer" }}>
        <span className="title">Permissions</span>
      </summary>
      <div className="services">
        <FormGroup className="service-options">
          <FormControlLabel
            control={
              <Checkbox
                checked={docLink}
                onClick={() => setDocLink(!docLink)}
              />
            }
            label="Documentation Link Available"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={accessToFSEFunctions}
                onClick={() => setAccessToFSEFunctions(!accessToFSEFunctions)}
              />
            }
            label="Access to FSE functions"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={auditEnable}
                onClick={() => setAuditEnable(!auditEnable)}
              />
            }
            label="Audit Enable"
          />
        </FormGroup>

        <FormGroup className="options">
          <FormControlLabel
            control={
              <Checkbox
                checked={possibilitytoLeave}
                onClick={() => setPossibilitytoLeave(!possibilitytoLeave)}
              />
            }
            label="Possibility to Leave Notes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={viewOnly}
                onClick={() => setViewOnly(!viewOnly)}
              />
            }
            label="View Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={oneTimeLinkCreation}
                onClick={() => setOneTimeLinkCreation(!oneTimeLinkCreation)}
              />
            }
            label="One-time Link Creation"
          />
        </FormGroup>
      </div>
    </details>
  );
};

export default Permissions;
