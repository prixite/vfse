import { useEffect, useState } from "react";
import * as React from "react";

import { Box, Grid } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import SiteSection from "@src/components/common/Smart/SiteSection/SiteSection";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import { constants, organizationTabs } from "@src/helpers/utils/constants";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  Organization,
  useOrganizationsListQuery,
  useOrganizationsMeReadQuery,
} from "@src/store/reducers/api";
import { closeAddModal } from "@src/store/reducers/appStore";

import BreadCrumb from "../../Presentational/BreadCrumb/BreadCrumb";

const OrganizationSection = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { openAddClientModal } = useAppSelector((state) => state.app);
  const [organization, setOrganization] = useState(null);
  const [organizationsList, setOrganizationsList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [action, setAction] = useState("");
  const [itemsList, setItemsList] = useState<Array<Organization>>([]);
  const [slicePointer, setSlicePointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedOrganizationList, setPaginatedOrganizationList] = useState<
    Array<Organization>
  >([]);
  const selectedOrganization = useSelectedOrganization();
  const {
    data: organizationList,
    refetch,
    isFetching: isOrgListFetching,
  } = useOrganizationsListQuery({
    page: 1,
  });
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );

  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const { searching } = localizedData().common;
  const { organizationRoute, networkRoute, sitesRoute } = constants;
  const { id } = useParams();

  const { title, noDataDescription, noDataTitle } =
    localizedData().organization;

  const handleClose = () => dispatch(closeAddModal());

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    if (
      event.target.innerText.toLowerCase() == organizationTabs[0].toLowerCase()
    ) {
      history.replace(`/${organizationRoute}/${id}/${networkRoute}/`);
    } else {
      history.replace(`/${organizationRoute}/${id}/${sitesRoute}/`);
    }
  };
  const fetchMoreSection = () => {
    setSlicePointer((prevState) => prevState + 22);
    if (slicePointer + 22 >= organizationList?.length) {
      setHasMore(false);
    }
    setTimeout(() => {
      setPaginatedOrganizationList((prevState) => [
        ...prevState.concat([
          ...organizationList.slice(slicePointer, slicePointer + 22),
        ]),
      ]);
    }, 0);
  };

  const showTabs = () => {
    const pathUrl = history.location.pathname.split("/");
    return (
      (pathUrl[pathUrl.length - 1] || pathUrl[pathUrl.length - 2]) ==
        "networks" ||
      (pathUrl[pathUrl.length - 1] || pathUrl[pathUrl.length - 2]) == "sites"
    );
  };
  const handleSearchQuery = (searchQuery: string) => {
    setItemsList(
      organizationList?.filter((organization) => {
        return (
          organization?.name
            ?.toLowerCase()
            .search(searchQuery?.toLowerCase()) != -1
        );
      })
    );
  };
  useEffect(() => {
    if (history.location.pathname.includes("sites")) {
      setTabValue(1);
    }
  }, []);
  useEffect(() => {
    if (
      searchText?.length > 2 &&
      organizationList &&
      organizationList?.length
    ) {
      handleSearchQuery(searchText);
    } else if (organizationList?.length && searchText?.length <= 2) {
      setItemsList(organizationList);
    }
  }, [searchText, organizationList]);
  useEffect(() => {
    if (organizationList && organizationList?.length) {
      setPaginatedOrganizationList([
        ...organizationList.slice(0, slicePointer + 22),
      ]);
      setSlicePointer((prevState) => prevState + 22);
    }
  }, [organizationList]);

  return (
    <>
      {history.location.pathname.includes("networks") ||
      history.location.pathname.includes("sites") ? (
        <BreadCrumb
          breadCrumbList={[
            {
              name: "Home",
              route: `/${organizationRoute}/${selectedOrganization?.id}/`,
            },
            {
              name: selectedOrganization?.name,
            },
          ]}
        />
      ) : (
        ""
      )}
      <Box component="div" className="OrganizationSection">
        {!showTabs() ? <h2>{title}</h2> : <h2>{selectedOrganization?.name}</h2>}
        {showTabs() ? (
          <>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: buttonBackground,
                },
              }}
            >
              {organizationTabs.map((tab: string, index: number) => {
                return (
                  <Tab
                    key={index}
                    label={tab}
                    sx={{
                      "&.Mui-selected": {
                        color: buttonBackground,
                      },
                    }}
                    className="tab-style"
                  />
                );
              })}
            </Tabs>
            <hr
              style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }}
            />
          </>
        ) : (
          ""
        )}
        {!showTabs() ? (
          <>
            {!isOrgListFetching ? (
              <TopViewBtns
                path="organizations"
                setAction={setAction}
                setData={setOrganization}
                setList={setOrganizationsList}
                actualData={organizationList}
                handleSearchQuery={handleSearchQuery}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            ) : (
              ""
            )}
            <Grid
              container
              spacing={2}
              className="OrganizationSection__AllClients"
            >
              {searchText?.length > 2 ? (
                itemsList && itemsList.length ? (
                  itemsList.map((item, key) => (
                    <Grid key={key} item xs={12} xl={3} md={4}>
                      <ClientCard
                        setAction={setAction}
                        setOrganization={setOrganization}
                        row={item}
                        refetch={refetch}
                        id={item.id}
                        name={item.name}
                        logo={item.appearance.logo}
                        selected={+id === item?.id ? true : false}
                        superuser={me?.is_superuser}
                      />
                    </Grid>
                  ))
                ) : organizationsList?.query === searchText ? (
                  <NoDataFound
                    search
                    setQuery={setSearchText}
                    queryText={searchText}
                    title={noDataTitle}
                    description={noDataDescription}
                  />
                ) : (
                  <div
                    style={{
                      color: "gray",
                      marginLeft: "45%",
                      marginTop: "20%",
                    }}
                  >
                    <h2>{searching}</h2>
                  </div>
                )
              ) : paginatedOrganizationList &&
                paginatedOrganizationList.length ? (
                <InfiniteScroll
                  dataLength={paginatedOrganizationList.length}
                  next={fetchMoreSection}
                  hasMore={hasMore}
                  loader={
                    <h4
                      style={{
                        width: "100%",
                        textAlign: "center",
                        color: "#696f77",
                      }}
                    >
                      Loading...
                    </h4>
                  }
                >
                  <Grid
                    container
                    xs={12}
                    item
                    spacing={2}
                    style={{ marginTop: "0px" }}
                  >
                    {paginatedOrganizationList.map((item, key) => (
                      <Grid key={key} item xs={12} sm={6} xl={3} md={4}>
                        <ClientCard
                          setAction={setAction}
                          setOrganization={setOrganization}
                          row={item}
                          refetch={refetch}
                          id={item.id}
                          name={item.name}
                          logo={item.appearance.logo}
                          selected={+id === item?.id ? true : false}
                          superuser={me?.is_superuser}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </InfiniteScroll>
              ) : (
                <NoDataFound
                  title={noDataTitle}
                  description={noDataDescription}
                />
              )}
            </Grid>
            {openAddClientModal ? (
              <OrganizationModal
                action={action}
                organization={organization}
                open={openAddClientModal}
                handleClose={handleClose}
                refetch={refetch}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          <>{tabValue == 0 ? <ModalitySection /> : <SiteSection />}</>
        )}
      </Box>
    </>
  );
};
export default OrganizationSection;
