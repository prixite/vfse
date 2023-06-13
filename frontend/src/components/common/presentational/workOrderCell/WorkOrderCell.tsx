import { useState } from "react";

import Flicking from "@egjs/react-flicking";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import "@src/components/common/presentational/workOrderCell/workOrderCell.scss";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsModalitiesListQuery,
  api,
} from "@src/store/reducers/api";

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
  const { t } = useTranslation();
  const [modality, setModality] = useState(null);
  const selectedOrganization = useSelectedOrganization();
  const { buttonTextColor, buttonBackground } = useAppSelector(
    (state) => state.myTheme
  );
  const { data: modalitiesList = [] } = useOrganizationsModalitiesListQuery(
    { id: selectedOrganization.id.toString() },
    { skip: !selectedOrganization }
  );
  const { data: systemsData = [], isLoading: isSystemsLoading } =
    api.useGetWorkOrdersQuery();

  const changeModality = (item) => {
    if (item == null) {
      setModality(null);
    } else {
      setModality(item?.id.toString());
    }
  };

  return (
    <>
      <Box className="upper_class" sx={{ width: "100%" }}>
        <Box>
          <div className="modalities">
            <Flicking
              defaultIndex={0}
              deceleration={0.0075}
              horizontal
              bound
              gap={20}
              style={{
                display: "flex",
                alignItems: "center",
                height: "33px",
                msOverflowX: "scroll",
                width: "100%",
                margin: "10px 0px",
              }}
            >
              <span
                className="modality"
                style={{
                  color: `${modality === null ? buttonBackground : ""}`,
                  borderBottom: `${
                    modality === null ? `2px solid ${buttonBackground}` : ""
                  }`,
                }}
                onClick={() => changeModality(null)}
              >
                All
              </span>
              {modalitiesList?.map((item, key) => (
                <span
                  key={key}
                  className="modality"
                  style={{
                    color: `${
                      modality === item?.id.toString() ? buttonBackground : ""
                    }`,
                    borderBottom: `${
                      modality === item?.id.toString()
                        ? `2px solid ${buttonBackground}`
                        : ""
                    }`,
                  }}
                  onClick={() => changeModality(item)}
                >
                  {item.name}
                </span>
              ))}
            </Flicking>
          </div>
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
                      {t("Connect")}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound
                title={t("Sorry! No results found. :(")}
                description={t("Try Again")}
              />
            )
          ) : (
            <p>{t("Loading ...")}</p>
          )}
        </Box>
      </Box>
    </>
  );
}
