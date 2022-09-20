/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const SitesMenu = ({
  site,
  systems,
  formik,
  handleSystemSelection,
  handleSitesSelection,
}) => {
  // console.log("systems", systems);
  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 5 }}>
      {systems?.map((item, key) => {
        return (
          <FormControlLabel
            key={key}
            label={item?.name}
            control={
              <Checkbox
                onChange={(e) => handleSystemSelection(e, site?.id)}
                checked={formik.values.selectedSystems.includes(item?.id)}
                value={item?.id}
                name={item?.name}
                color="primary"
              />
            }
          />
        );
      })}
    </Box>
  );

  const isIntermediate = () => {
    if (
      systems.every((item) => formik.values.selectedSystems.includes(item?.id))
    ) {
      return false;
    }
    if (
      systems.some((item) => formik.values.selectedSystems.includes(item?.id))
    ) {
      return true;
    }
  };

  return (
    <details className="network-details">
      <summary className="header" style={{ cursor: "pointer" }}>
        <FormControlLabel
          label={site?.name}
          sx={{ ml: "3px" }}
          control={
            <Checkbox
              indeterminate={isIntermediate()}
              onChange={handleSitesSelection}
              checked={formik.values.selectedSites.includes(site?.id)}
              value={site?.id}
              name={site?.name}
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
