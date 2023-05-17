import { useState, useEffect } from "react";

import Flicking from "@egjs/react-flicking";
import { Box } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import BreadCrumb from "@src/components/common/presentational/breadCrumb/BreadCrumb";
import ChatBox from "@src/components/common/presentational/chatBox/ChatBox";
import SystemCard from "@src/components/common/presentational/systemCard/SystemCard";
import SystemCardMobile from "@src/components/common/presentational/systemCard/systemCardMobile/SystemCardMobile";
import CommentsDrawer from "@src/components/common/smart/commentsDrawer/CommentsDrawer";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import AddSiteFirstModal from "@src/components/shared/popUps/addSiteFirstModal/AddSiteFirstModal";
import SystemModal from "@src/components/shared/popUps/systemModal/SystemModal";
import ViewMapModal from "@src/components/shared/popUps/viewMapModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { returnSearchedOject } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
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
  useOrganizationsAssociatedSitesListQuery,
  useOrganizationsSystemsUpdateFromInfluxMutation,
  api,
} from "@src/store/reducers/api";
import {
  System,
  useOrganizationsMeReadQuery,
} from "@src/store/reducers/generated";

import "@src/components/common/smart/systemSection/systemSection.scss";

const SystemSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    networksText,
    sitesText,
    modalityText,
    siteText,
    mri,
    organizationsSystemsList,
    health_network,
  } = constantsData.systemSection;
  const { loading } = constantsData.common;

  const dispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location?.search);
  const paramModality = queryParams?.get(modalityText);
  const [sites, setSites] = useState([]);
  const [networkFilter, setNetworkFilter] = useState({});
  const [siteFilter, setSiteFilter] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [system, setSystem] = useState(null);
  const [index, setIndex] = useState(null);
  // eslint-disable-next-line
  const [systemList, setSystemList] = useState({});
  const [itemsList, setItemsList] = useState<Array<System>>([]);
  const [searchText, setSearchText] = useState("");
  const [firstRender, setFirstRender] = useState(true);
  const [modality, setModality] = useState();
  const [callSystemsApi, setCallSystemsApi] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatBoxSystem, setChatBoxSystem] = useState<System>();

  const [browserWidth] = useWindowSize();
  const { organizationRoute } = constants;
  const { siteId, networkId, id } = useParams<{
    siteId: string;
    networkId: string;
    id: string;
  }>();
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { searching } = localizedData().common;
  const selectedID = networkId || id;

  const { data: systemLocationList = [] } = api.useGetSystemLocationsQuery(
    { organizationId: selectedID, systemId: system?.id },
    { skip: !system?.id || !selectedID }
  );

  const { data: organization, isFetching: fetching } =
    useOrganizationsReadQuery(
      {
        id: selectedID,
      },
      {
        skip: !selectedID,
      }
    );

  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();
  const { data: me } = useOrganizationsMeReadQuery({
    id: selectedOrganization?.id.toString(),
  });

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
    useOrganizationsSystemsListQuery(apiArgData, {
      skip: !(apiArgData && callSystemsApi),
    });

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
  }, [modalitiesList, paramModality]);

  const handleEdit = (system) => {
    setOpen(true);
    setSystem(system);
  };

  const returnSiteName = () => {
    if (
      location.pathname.includes(networksText) &&
      location.pathname.includes(sitesText)
    ) {
      return returnSearchedOject(organization?.sites, siteId)[0]?.name;
    } else if (location.pathname.includes(sitesText)) {
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
      queryParams.delete(modalityText);
      navigate(
        {
          search: queryParams.toString(),
        },
        { replace: true }
      );
    } else {
      setModality(item?.id.toString());
      setApiArgData({ ...apiArgData, modality: item?.id.toString() });
      queryParams.set(modalityText, item?.id.toString());
      navigate(
        {
          pathname: location.pathname,
          search: queryParams.toString(),
        },
        { replace: true }
      );
    }
  };

  useEffect(() => {
    if (firstRender && systemsData && selectedOrganization) {
      Promise.all(
        systemsData.map(async (system) => {
          if (system.product_model_detail.modality.group !== mri) {
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
            organizationsSystemsList, // TODO: See if we can avoid hard-coding.
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
    if (searchText?.length >= 1 && systemList?.results) {
      setItemsList(systemList?.results);
    } else if (systemsData && searchText?.length <= 1 && !isSystemDataLoading) {
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
        (queryParams.get(health_network) == null ||
          queryParams.get(health_network) !== null)
      ) {
        setApiArgData((prevState) => {
          return { ...prevState, healthNetwork: networkFilter?.id };
        });
        queryParams.set(health_network, networkFilter?.id?.toString());
        navigate({
          pathname: location.pathname,
          search: queryParams.toString(),
        });
      } else if (
        Object.keys(networkFilter).length === 0 &&
        queryParams.get(health_network) === null
      ) {
        const TempArgs = {
          ...apiArgData,
        };
        delete TempArgs.healthNetwork;
        setApiArgData({ ...TempArgs });
      }
      if (
        apiArgData.healthNetwork == undefined &&
        queryParams.get(health_network) !== null
      ) {
        const TempNetwork = Object.keys(networkFilter).length
          ? networkFilter?.id
          : queryParams.get(health_network);
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
        (queryParams.get(siteText) == null ||
          queryParams.get(siteText) !== null)
      ) {
        setApiArgData({ ...apiArgData, site: siteFilter?.id });
        queryParams.set(siteText, siteFilter?.id?.toString());
        navigate({
          pathname: location.pathname,
          search: queryParams.toString(),
        });
      } else if (
        Object.keys(siteFilter).length === 0 &&
        queryParams.get(siteText) === null
      ) {
        const TempArg = {
          ...apiArgData,
        };

        delete TempArg.site;
        setApiArgData({ ...TempArg });
      }
      if (apiArgData.site == undefined && queryParams.get(siteText) !== null) {
        const tempSite = Object.keys(siteFilter).length
          ? siteFilter?.id
          : queryParams.get(siteText);
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
    setCallSystemsApi(true);
  }, [modality]);

  const addBreadcrumbs = () => {
    if (
      location.pathname.includes(sitesText) &&
      !fetching &&
      location.pathname.includes(networksText)
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
    } else if (location.pathname.includes(sitesText) && !fetching) {
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
                style={{ height: "33px", msOverflowX: "scroll", width: "100%" }}
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
      id: selectedID,
    },
    {
      skip: !selectedID,
    }
  );

  useEffect(() => {
    if (healthNetwork?.sites && allSites) {
      setSites(allSites);
    } else {
      setSites(selectedOrganization.sites);
    }
  }, [healthNetwork, selectedOrganization, isAllSitesLoading, allSites]);

  const viewSystemLocation = (system: System) => {
    setSystem(system);
    setOpenMapModal(true);
  };

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
                <SystemCard
                  viewSystemLocation={viewSystemLocation}
                  system={item}
                  handleEdit={handleEdit}
                  setSystem={setChatBoxSystem}
                  setIsOpen={setChatModal}
                  canLeaveNotes={me?.can_leave_notes}
                  currentUser={me}
                />
              </div>
            ))
          ) : (
            itemsList.map((item, key) => (
              <div key={key} style={{ marginTop: "16px" }}>
                <SystemCardMobile
                  viewSystemLocation={viewSystemLocation}
                  system={item}
                  handleEdit={handleEdit}
                  setSystem={setChatBoxSystem}
                  setIsOpen={setChatModal}
                  canLeaveNotes={me?.can_leave_notes}
                  currentUser={me}
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
            <h2>{searchText.length > 2 ? searching : loading}</h2>
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
        {me?.can_leave_notes && <CommentsDrawer />}
        <ViewMapModal
          open={openMapModal}
          handleClose={() => {
            setOpenMapModal(false);
            setSystem(null);
          }}
          points={systemLocationList}
        />
      </Box>
      {chatModal && browserWidth > mobileWidth ? (
        <ChatBox setIsOpen={setChatModal} system={chatBoxSystem} />
      ) : (
        <></>
      )}
      {chatModal && browserWidth < mobileWidth ? (
        <ChatBox setIsOpen={setChatModal} system={chatBoxSystem} />
      ) : (
        <></>
      )}
    </>
  );
};

export default SystemSection;
