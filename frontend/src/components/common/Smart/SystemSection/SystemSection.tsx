import { useState, useEffect } from "react";

import Flicking from "@egjs/react-flicking";
import { Box } from "@mui/material";
import { useLocation, useHistory, useParams } from "react-router-dom";

import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import SystemCardMobile from "@src/components/common/Presentational/SystemCard/SystemCardMobile";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import AddSiteFirstModal from "@src/components/shared/popUps/AddSiteFirstModal/AddSiteFirstModal";
import SystemModal from "@src/components/shared/popUps/SystemModal/SystemModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { returnSearchedOject } from "@src/helpers/utils/utils";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  useOrganizationsSystemsListQuery,
  useOrganizationsModalitiesListQuery,
  useOrganizationsReadQuery,
  OrganizationsSystemsListApiArg,
  Modality,
  useOrganizationsAssociatedSitesListQuery,
  useOrganizationsSystemsUpdateFromInfluxMutation,
  api,
} from "@src/store/reducers/api";

import BreadCrumb from "../../Presentational/BreadCrumb/BreadCrumb";
import CommentsDrawer from "../CommentsDrawer/CommentsDrawer";

import "@src/components/common/Smart/SystemSection/SystemSection.scss";

const SystemSection = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const queryParams = new URLSearchParams(location?.search);
  const paramModality = queryParams?.get("modality");
  const [sites, setSites] = useState([]);
  const [networkFilter, setNetworkFilter] = useState({});
  const [siteFilter, setSiteFilter] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [system, setSystem] = useState(null);
  const [index, setIndex] = useState(null);
  // eslint-disable-next-line
  const [systemList, setSystemList] = useState({});
  const [itemsList, setItemsList] = useState<Array<Modality>>([]);
  const [searchText, setSearchText] = useState("");
  const [firstRender, setFirstRender] = useState(true);
  const [modality, setModality] = useState();
  const [browserWidth] = useWindowSize();
  const { organizationRoute } = constants;
  const { siteId, networkId } =
    useParams<{ siteId: string; networkId: string }>();
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { searching } = localizedData().common;
  const isOrganizationModality =
    !history?.location?.pathname.includes("sites") &&
    !history?.location?.pathname.includes("networks");
  const { data: organization, isFetching: fetching } =
    useOrganizationsReadQuery(
      {
        id: networkId,
      },
      {
        skip: !networkId,
      }
    );
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();

  const { data: allSites, isLoading: isAllSitesLoading } =
    useOrganizationsAssociatedSitesListQuery(
      {
        id: selectedOrganization.id.toString(),
      },
      { skip: !selectedOrganization }
    );

  const { isLoading: isModalitiesLoading, data: modalitiesList } =
    useOrganizationsModalitiesListQuery(
      { id: selectedOrganization.id.toString() },
      { skip: !selectedOrganization }
    );

  const [apiArgData, setApiArgData] = useState<OrganizationsSystemsListApiArg>({
    id: selectedOrganization?.id.toString(),
  });

  const { data: systemsData, isLoading: isSystemDataLoading } =
    useOrganizationsSystemsListQuery(apiArgData);

  const [updateFromInflux] = useOrganizationsSystemsUpdateFromInfluxMutation();

  useEffect(() => {
    modalitiesList?.length &&
      modalitiesList?.map((item, key) => {
        if (item?.id.toString() === paramModality) {
          return setIndex(key + 1);
        }
      });
    if (!paramModality) {
      setIndex(1);
    }
  }, [modalitiesList]);

  const handleEdit = (system) => {
    setOpen(true);
    setSystem(system);
  };

  const returnSiteName = () => {
    if (
      history.location.pathname.includes("networks") &&
      history.location.pathname.includes("sites")
    ) {
      return returnSearchedOject(organization?.sites, siteId)[0]?.name;
    } else if (history.location.pathname.includes("sites")) {
      return returnSearchedOject(sites, siteId)[0]?.name;
    }
    return selectedOrganization?.name;
  };

  const changeModality = (item) => {
    if (item == null) {
      // if no modality selected
      const TempArgs = {
        ...apiArgData,
      };
      delete TempArgs?.modality;
      setApiArgData({ ...TempArgs });
      setModality(null);
      queryParams.delete("modality");
      history.replace({
        search: queryParams.toString(),
      });
    } else {
      setModality(item?.id.toString());
      setApiArgData({ ...apiArgData, modality: item?.id.toString() });
      queryParams.set("modality", item?.id.toString());
      history.replace({
        pathname: history.location.pathname,
        search: queryParams.toString(),
      });
    }
  };

  useEffect(() => {
    if (firstRender && systemsData && selectedOrganization) {
      Promise.all(
        systemsData.map(async (system) => {
          if (system.product_model_detail.modality.group !== "mri") {
            return system;
          }

          const data = await updateFromInflux({
            id: selectedOrganization.id.toString(),
            systemPk: system.id.toString(),
            system: system,
          }).unwrap();
          return {
            ...system,
            ...{ mri_embedded_parameters: data.mri_embedded_parameters },
          };
        })
      ).then((systems) => {
        // Update cache data so that frontend is updated and we don't have to
        // send request to backend.
        dispatch(
          api.util.updateQueryData(
            "organizationsSystemsList",
            { id: selectedOrganization.id.toString() },
            (draftSystems) => {
              Object.assign(draftSystems, systems);
            }
          )
        );
        setSystemList(systems);
      });
    }
  }, [selectedOrganization, systemsData, firstRender]);

  useEffect(() => {
    if (!isSystemDataLoading && systemsData?.length) {
      setFirstRender(false);
    }
  }, [itemsList]);

  useEffect(() => {
    if (searchText?.length > 2 && systemList?.results) {
      setItemsList(systemList?.results);
    } else if (systemsData?.length && searchText?.length <= 2) {
      setItemsList(systemsData);
    } else if (!isSystemDataLoading) {
      setFirstRender(false);
    }
  }, [searchText, systemsData, systemList]);

  useEffect(() => {
    if (networkId) {
      setApiArgData((prevState) => {
        return { ...prevState, healthNetwork: networkId.toString() };
      });
    }

    if (!networkId) {
      if (
        Object.keys(networkFilter).length !== 0 &&
        (queryParams.get("health_network") == null ||
          queryParams.get("health_network") !== null)
      ) {
        setApiArgData((prevState) => {
          return { ...prevState, healthNetwork: networkFilter?.id };
        });
        queryParams.set("health_network", networkFilter?.id?.toString());
        history.push({
          pathname: history.location.pathname,
          search: queryParams.toString(),
        });
      } else if (
        Object.keys(networkFilter).length === 0 &&
        queryParams.get("health_network") === null
      ) {
        const TempArgs = {
          ...apiArgData,
        };
        delete TempArgs.healthNetwork;
        setApiArgData({ ...TempArgs });
      }
      if (
        apiArgData.healthNetwork == undefined &&
        queryParams.get("health_network") !== null
      ) {
        const TempNetwork = Object.keys(networkFilter).length
          ? networkFilter?.id
          : queryParams.get("health_network");
        setApiArgData((prevState) => {
          return { ...prevState, healthNetwork: TempNetwork };
        });
      }
    }
  }, [networkId, networkFilter]);
  useEffect(() => {
    if (siteId) {
      setApiArgData((prevState) => {
        return { ...prevState, site: siteId.toString() };
      });
    }

    if (!siteId) {
      if (
        Object.keys(siteFilter).length !== 0 &&
        (queryParams.get("site") == null || queryParams.get("site") !== null)
      ) {
        setApiArgData({ ...apiArgData, site: siteFilter?.id });
        queryParams.set("site", siteFilter?.id?.toString());
        history.push({
          pathname: history.location.pathname,
          search: queryParams.toString(),
        });
      } else if (
        Object.keys(siteFilter).length === 0 &&
        queryParams.get("site") === null
      ) {
        const TempArg = {
          ...apiArgData,
        };

        delete TempArg.site;
        setApiArgData({ ...TempArg });
      }
      if (apiArgData.site == undefined && queryParams.get("site") !== null) {
        const tempSite = Object.keys(siteFilter).length
          ? siteFilter?.id
          : queryParams.get("site");
        setApiArgData((prevState) => {
          return { ...prevState, site: tempSite };
        });
      }
    }
  }, [siteId, siteFilter]);
  useEffect(() => {
    setModality(paramModality);
  }, [paramModality]);
  useEffect(() => {
    if (modality) {
      setApiArgData({ ...apiArgData, modality });
    }
  }, [modality]);

  const addBreadcrumbs = () => {
    if (
      history.location.pathname.includes("sites") &&
      !fetching &&
      history.location.pathname.includes("networks")
    ) {
      return (
        <BreadCrumb
          breadCrumbList={[
            {
              name: "Home",
              route: `/${organizationRoute}/${selectedOrganization?.id}/`,
            },
            {
              name: selectedOrganization?.name,
              route: `/${organizationRoute}/${selectedOrganization?.id}/networks/`,
            },
            {
              name: organization?.name,
              route: `/${organizationRoute}/${selectedOrganization?.id}/networks/${networkId}/sites/`,
            },
            {
              name: returnSearchedOject(organization?.sites, siteId)[0]?.name,
            },
          ]}
        />
      );
    } else if (history.location.pathname.includes("sites") && !fetching) {
      return (
        <BreadCrumb
          breadCrumbList={[
            {
              name: "Home",
              route: `/${organizationRoute}/${selectedOrganization?.id}`,
            },
            {
              name: selectedOrganization?.name,
              route: `/${organizationRoute}/${selectedOrganization?.id}/sites`,
            },
            {
              name: returnSearchedOject(sites, siteId)[0]?.name,
            },
          ]}
        />
      );
    } else {
      return "";
    }
  };

  const createModalitySection = () => {
    return (
      <div style={{ width: "100%" }}>
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
            <hr
              style={{
                borderTop: "1px solid #D4D6DB",
                marginBottom: "32px",
                marginTop: "-3px",
                zIndex: "-1",
              }}
            />
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

  const { data: healthNetwork } = useOrganizationsReadQuery(
    {
      id: networkId,
    },
    {
      skip: !networkId,
    }
  );

  useEffect(() => {
    if (healthNetwork) {
      setSites(healthNetwork.sites);
    } else if (isOrganizationModality && !isAllSitesLoading) {
      setSites(allSites);
    } else {
      setSites(selectedOrganization.sites);
    }
  }, [healthNetwork, selectedOrganization, isAllSitesLoading]);

  return (
    <>
      {addBreadcrumbs()}
      <Box component="div" className="system-section">
        <h2>{!fetching ? returnSiteName() : ""}</h2>
        {createModalitySection()}
        {!isSystemDataLoading ? (
          <TopViewBtns
            setOpen={!sites?.length ? setOpenConfirmModal : setOpen}
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
        {!isSystemDataLoading && itemsList && itemsList?.length ? (
          browserWidth > mobileWidth ? (
            itemsList.map((item, key) => (
              <div key={key} style={{ marginTop: "16px" }}>
                <SystemCard system={item} handleEdit={() => handleEdit(item)} />
              </div>
            ))
          ) : (
            itemsList.map((item, key) => (
              <div key={key} style={{ marginTop: "16px" }}>
                <SystemCardMobile
                  system={item}
                  handleEdit={() => handleEdit(item)}
                />
              </div>
            ))
          )
        ) : !itemsList?.length && !isSystemDataLoading && !firstRender ? (
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
          <div
            style={{
              color: "gray",
              marginLeft: "45%",
              marginTop: "20%",
            }}
          >
            <h2>{searchText.length > 2 ? searching : "Loading...."}</h2>
          </div>
        )}
        {open ? (
          <SystemModal
            open={open}
            handleClose={() => setOpen(false)}
            system={system}
            setSystem={setSystem}
          />
        ) : (
          ""
        )}
        <AddSiteFirstModal
          open={openConfirmModal}
          handleClose={() => setOpenConfirmModal(false)}
        />
        <CommentsDrawer />
      </Box>
    </>
  );
};

export default SystemSection;
