import { useState, useEffect } from "react";

import Flicking from "@egjs/react-flicking";
import { Box } from "@mui/material";
import { useLocation, useHistory, useParams } from "react-router-dom";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import SystemModal from "@src/components/shared/popUps/SystemModal/SystemModal";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsSystemsListQuery,
  useModalitiesListQuery,
} from "@src/store/reducers/api";
import "@src/components/common/Smart/SystemSection/SystemSection.scss";

const SystemSection = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location?.search);
  const paramModality = queryParams?.get("modality");

  const [networkFilter, setNetworkFilter] = useState({});
  const [siteFilter, setSiteFilter] = useState({});
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [system, setSystem] = useState(null);
  const [index, setIndex] = useState(null);
  // eslint-disable-next-line
  const [systemList, setSystemList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [modality, setModality] = useState(paramModality);
  const { siteId, networkId } = useParams();
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { searching } = localizedData().common;
  const { isLoading: isModalitiesLoading, data: modalitiesList } =
    useModalitiesListQuery();
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const apiData = {
    page: 1,
    id: selectedOrganization?.id.toString(),
  };

  useEffect(() => {
    modalitiesList?.length &&
      modalitiesList?.map((item, key) => {
        if (item.id === +modality) {
          return setIndex(key + 1);
        }
      });
    if (!modality) {
      setIndex(1);
    }
  }, [modalitiesList]);

  const changeModality = (item) => {
    if (item == null) {
      // if no modality selected
      delete apiData.modality;
      setModality(null);
      queryParams.delete("modality");
      history.replace({
        search: queryParams.toString(),
      });
    } else {
      setModality(item?.id.toString());
      queryParams.set("modality", item?.id.toString());
      history.replace({
        pathname: history.location.pathname,
        search: queryParams.toString(),
      });
    }
    systemsRefetch();
  };

  if (modality) {
    apiData.modality = modality;
  }
  useEffect(()=>{
    if (siteId) {
      apiData.site = siteId.toString();
    }
  
    if (!siteId) {
      if (
        Object.keys(siteFilter).length !== 0 &&
        (queryParams.get("site") == null || queryParams.get("health_network") !== null)
      ) {
        apiData.site = siteFilter?.id;
        queryParams.set("site", siteFilter?.id?.toString());
        history.push({
          pathname: history.location.pathname,
          search: queryParams.toString(),
        });
      } else if (
        Object.keys(siteFilter).length === 0 &&
        queryParams.get("site") !== null
      ) {
        delete apiData.site;
      }
      if (apiData.site == undefined && queryParams.get("site") !== null) {
        apiData.site = Object.keys(siteFilter).length
          ? siteFilter?.id
          : queryParams.get("site");
      }
    }
  },[siteId , siteFilter]);

  useEffect(()=>{
    if (networkId) {
      apiData.health_network = networkId.toString();
    }
  
    if (!networkId) {
      if (
        Object.keys(networkFilter).length !== 0 &&
        (queryParams.get("health_network") == null || queryParams.get("health_network") !== null)
      ) {
        apiData.health_network = networkFilter?.id;
        queryParams.set("health_network", networkFilter?.id?.toString());
        console.log("about to call push");
        history.push({
          pathname: history.location.pathname,
          search: queryParams.toString(),
        });
      }
      else if (
        Object.keys(networkFilter).length === 0 &&
        queryParams.get("health_network") !== null
      ) {
        delete apiData.health_network;
      }
      if (
        apiData.health_network == undefined &&
        queryParams.get("health_network") !== null
      ) {
        apiData.health_network = Object.keys(networkFilter).length
          ? networkFilter?.id
          : queryParams.get("health_network");
      }
    }
  },[networkId , networkFilter])

  const {
    data: systemsData,
    isLoading: isSystemDataLoading,
    refetch: systemsRefetch,
  } = useOrganizationsSystemsListQuery(apiData);

  return (
    <Box component="div" className="system-section">
      <h2>{selectedOrganization?.name}</h2>
      <div
        style={{
          width: "100%",
        }}
      >
        {!isModalitiesLoading && index ? (
          <>
            <div className="modalities">
              <Flicking
                defaultIndex={index - 1}
                deceleration={0.0075}
                horizontal
                bound
                gap={40}
                style={{ height: "33px" }}
              >
                <span
                  className="modality"
                  style={{
                    color: `${modality === null ? buttonBackground : ""}`,
                    borderBottom: `${
                      modality === null ? `1px solid ${buttonBackground}` : ""
                    }`,
                  }}
                  onClick={() => changeModality(null)}
                >
                  All
                </span>
                {
                  // eslint-disable-next-line
                  modalitiesList?.length &&
                    modalitiesList?.map((item, key) => (
                      <span
                        key={key}
                        className="modality"
                        style={{
                          color: `${
                            modality === item?.id.toString()
                              ? buttonBackground
                              : ""
                          }`,
                          borderBottom: `${
                            modality === item?.id.toString()
                              ? `1px solid ${buttonBackground}`
                              : ""
                          }`,
                        }}
                        onClick={() => changeModality(item)}
                      >
                        {item.name}
                      </span>
                    ))
                }
              </Flicking>
            </div>
            <hr
              style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }}
            />
          </>
        ) : (
          ""
        )}
      </div>
      {!isSystemDataLoading ? (
        <TopViewBtns
          setOpen={setOpen}
          path="systems"
          setData={setSystem}
          setList={setSystemList}
          networkFilter={setNetworkFilter}
          siteFilter={setSiteFilter}
          actualData={systemsData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ) : (
        ""
      )}
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
      <SystemModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default SystemSection;
