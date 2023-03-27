import React from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Site, System } from "@src/store/reducers/generated";
import { Formik } from "@src/types/interfaces";

import SystemReadOnly from "../SystemReadOnly";

interface Props {
  site: Site;
  handleSystemReadStatus: (systemId: number, is_read_only: boolean) => void;
  systems: System[];
  systemStatus: Map<number, { system: number; is_read_only: boolean }>;
  formik: Formik;
  handleSystemSelection: (
    event: React.ChangeEvent<HTMLInputElement>,
    site: number
  ) => void;
  handleSitesSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SitesMenu = ({
  site,
  systems,
  formik,
  systemStatus,
  handleSystemSelection,
  handleSitesSelection,
  handleSystemReadStatus,
}: Props) => {
  const handleReadOnly = (event, systemId) => {
    const checked = event.target.checked;
    handleSystemReadStatus(systemId, checked);
    if (checked && !formik.values.selectedSystems.includes(systemId)) {
      handleSystemSelection(
        { target: { value: systemId, checked: true } },
        site.id
      );
    }
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 5 }}>
      {systems.map((item) => {
        return (
          <div key={`${item.id}-system`}>
            <FormControlLabel
              label={item.name}
              control={
                <Checkbox
                  onChange={(e) => handleSystemSelection(e, site.id)}
                  checked={formik.values.selectedSystems.includes(item.id)}
                  value={item.id}
                  name={item.name}
                  color="primary"
                />
              }
            />
            <SystemReadOnly
              handleReadOnly={handleReadOnly}
              system={item.id}
              systemStatus={systemStatus}
            />
          </div>
        );
      })}
    </Box>
  );

  const isIntermediate = () => {
    if (
      systems.every((item) => formik.values.selectedSystems.includes(item.id))
    ) {
      return false;
    } else if (
      systems.some((item) => formik.values.selectedSystems.includes(item.id))
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <details className="network-details">
      <summary className="header" style={{ cursor: "pointer" }}>
        <FormControlLabel
          label={site.name}
          sx={{ ml: "3px" }}
          control={
            <Checkbox
              indeterminate={isIntermediate()}
              onChange={handleSitesSelection}
              checked={formik.values.selectedSites.includes(site.id)}
              value={site.id}
              name={site.name}
              color="primary"
            />
          }
        />
      </summary>
      {children}
    </details>
  );
};

export default SitesMenu;
