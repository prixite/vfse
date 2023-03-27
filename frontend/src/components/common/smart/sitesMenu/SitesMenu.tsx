import { Switch } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Site, System } from "@src/store/reducers/generated";
import { Formik } from "@src/types/interfaces";

interface Props {
  site: Site;
  systems: System[];
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
  handleSystemSelection,
  handleSitesSelection,
}: Props) => {
  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 5 }}>
      {systems.map((item, key) => {
        return (
          <>
            <FormControlLabel
              key={key}
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
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Label"
            />
          </>
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
