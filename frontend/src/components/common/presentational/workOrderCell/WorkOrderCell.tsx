import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";

import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import "@src/components/common/presentational/workOrderCell/workOrderCell.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsModalitiesListQuery,
  api,
} from "@src/store/reducers/api";

const { connect } = localizedData().systems_card;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function WorkOrderCell() {
  const [value, setValue] = useState("");
  const selectedOrganization = useSelectedOrganization();
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { buttonTextColor, buttonBackground } = useAppSelector(
    (state) => state.myTheme
  );
  const { data: modalitiesList = [] } = useOrganizationsModalitiesListQuery(
    { id: selectedOrganization.id.toString() },
    { skip: !selectedOrganization }
  );
  const { data: systemsData = [], isLoading: isSystemsLoading } =
    api.useGetWorkOrdersQuery();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box className="upper_class" sx={{ width: "100%" }}>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              key="All"
              label="All"
              value=""
              sx={{
                "&.Mui-selected": {
                  color: "#0000FF",
                },
              }}
              className="tab-style"
            />
            {modalitiesList.map((modality) => (
              <Tab
                key={modality?.id}
                value={modality?.id}
                label={modality?.name}
                sx={{
                  "&.Mui-selected": {
                    color: "#0000FF",
                  },
                }}
                className="tab-style"
              />
            ))}
          </Tabs>
        </Box>
        <Box component="div" className="systems">
          {!isSystemsLoading ? (
            systemsData.length ? (
              systemsData.slice(0, 5).map((system, key) => (
                <div className="root_section" key={key}>
                  <div className="img_section">
                    <div className="img_div">
                      <img
                        src={system?.system?.image_url}
                        className="imgStyling"
                      />
                    </div>
                    <div className="detail_section">
                      <div className="title">{system?.system?.name}</div>
                      <div className="subtitle">{system?.description}</div>
                    </div>
                  </div>
                  <div className="btn_section">
                    <Button
                      className="connect_btn"
                      style={{
                        color: buttonTextColor,
                        backgroundColor: buttonBackground,
                      }}
                    >
                      {connect}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound
                title={noDataTitle}
                description={noDataDescription}
              />
            )
          ) : (
            <p>Loading ...</p>
          )}
        </Box>
      </Box>
    </>
  );
}
