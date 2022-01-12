import { useState, useRef } from "react";

import Flicking from "@egjs/react-flicking";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsSystemsListQuery,
  useSitesSystemsListQuery,
  useModalitiesListQuery,
} from "@src/store/reducers/api";
import "@src/components/common/Smart/SystemSection/SystemSection.scss";

const SystemSection = () => {
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [system, setSystem] = useState(null);
  // eslint-disable-next-line
  const [systemList, setSystemList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [modality, setModality] = useState(0);
  const carouselRef = useRef(null);

  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const { data: modalitiesList } = useModalitiesListQuery();

  const handleClick = (index) => {
    setModality(index);
  };
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { searching } = localizedData().common;
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { siteId } = useParams();

  const { data: systemsData, isLoading: isSystemDataLoading } =
    siteId == undefined
      ? useOrganizationsSystemsListQuery({
          page: 1,
          id: selectedOrganization?.id.toString(),
        })
      : useSitesSystemsListQuery({ page: 1, id: siteId?.toString() });

  return (
    <Box component="div" className="system-section">
      <h2>{selectedOrganization?.name}</h2>
      <div
        style={{
          width: "100%",
        }}
      >
        <div className="modalities">
          <Flicking
            ref={carouselRef}
            tag="div"
            viewportTag="div"
            cameraTag="div"
            classPrefix="eg-flick"
            deceleration={0.0075}
            horizontal
            bound
            gap={40}
            style={{ height: "33px" }}
          >
            {
              // eslint-disable-next-line
              modalitiesList?.map((item, key) => (
                <span
                  key={key}
                  className="modality"
                  style={{
                    color: `${modality === key ? buttonBackground : ""}`,
                    borderBottom: `${
                      modality === key ? `1px solid ${buttonBackground}` : ""
                    }`,
                  }}
                  onClick={() => handleClick(key)}
                >
                  {item.name}
                </span>
              ))
            }
          </Flicking>
        </div>
        <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      </div>
      <TopViewBtns
        setOpen={setOpen}
        path="systems"
        setData={setSystem}
        setList={setSystemList}
        actualData={systemsData}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {searchText?.length > 2 ? (
        !isSystemDataLoading &&
        systemList &&
        systemList?.results?.length &&
        systemList?.query === searchText ? (
          systemList?.results?.map((item, key) => (
            <div key={key} style={{ marginTop: "32px" }}>
              <SystemCard
                name={item?.name}
                image={item?.image?.image}
                his_ris_info={item?.his_ris_info}
                dicom_info={item?.dicom_info}
                serial_number={item?.serial_number}
                asset_number={item?.asset_number}
                mri_embedded_parameters={item?.mri_embedded_parameters}
                ip_address={item?.ip_address}
                local_ae_title={item?.local_ae_title}
                software_version={item?.software_version}
                location_in_building={item?.location_in_building}
                grafana_link={item?.grafana_link}
                documentation={item?.documentation}
              />
            </div>
          ))
        ) : systemList?.query === searchText ? (
          <>
            <NoDataFound
              search
              setQuery={setSearchText}
              queryText={searchText}
              title={noDataTitle}
              description={noDataDescription}
            />
          </>
        ) : (
          <div style={{ color: "gray", marginLeft: "50%", marginTop: "20%" }}>
            <h2>{searching}</h2>
          </div>
        )
      ) : !isSystemDataLoading && !systemsData?.length ? (
        <NoDataFound title={noDataTitle} description={noDataDescription} />
      ) : (
        <div style={{ marginTop: "32px" }}>
          {systemsData?.map((item, key) => (
            <SystemCard
              key={key}
              name={item?.name}
              image={item?.image?.image}
              his_ris_info={item?.his_ris_info}
              dicom_info={item?.dicom_info}
              serial_number={item?.serial_number}
              asset_number={item?.asset_number}
              mri_embedded_parameters={item?.mri_embedded_parameters}
              ip_address={item?.ip_address}
              local_ae_title={item?.local_ae_title}
              software_version={item?.software_version}
              location_in_building={item?.location_in_building}
              grafana_link={item?.grafana_link}
              documentation={item?.documentation}
            />
          ))}
        </div>
      )}
    </Box>
  );
};

export default SystemSection;
