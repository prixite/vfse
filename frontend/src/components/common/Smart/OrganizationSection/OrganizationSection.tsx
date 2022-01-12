import { useEffect, useState } from "react";
import * as React from "react";

import { Box, Grid } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import { closeAddModal } from "@src/store/reducers/appStore";

const OrganizationSection = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { openAddClientModal } = useAppSelector((state) => state.app);
  const [organization, setOrganization] = useState(null);
  const [organizationsList, setOrganizationsList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [action, setAction] = useState("");
  const { data: organizationList, refetch } = useOrganizationsListQuery({
    page: 1,
  });
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
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
      history.replace(`/${organizationRoute}/${id}/${networkRoute}`);
    } else {
      history.replace(`/${organizationRoute}/${id}/${sitesRoute}`);
    }
  };

  const showTabs = () => {
    const pathUrl = history.location.pathname.split("/");
    return (
      (pathUrl[pathUrl.length - 1] || pathUrl[pathUrl.length - 2]) ==
        "networks" ||
      (pathUrl[pathUrl.length - 1] || pathUrl[pathUrl.length - 2]) == "sites"
    );
  };

  useEffect(() => {
    if (history.location.pathname.includes("sites")) {
      setTabValue(1);
    }
  }, []);

  return (
    <>
      <Box component="div" className="OrganizationSection">
        {!showTabs() ? <h2>{title}</h2> : <h2>{selectedOrganization?.name}</h2>}
        {showTabs() ? (
          <>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {organizationTabs.map((tab: string, index: number) => {
                return <Tab key={index} label={tab} className="tab-style" />;
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
            <TopViewBtns
              path="organizations"
              setAction={setAction}
              setData={setOrganization}
              setList={setOrganizationsList}
              actualData={organizationList}
              searchText={searchText}
              setSearchText={setSearchText}
            />
            <Grid
              container
              spacing={2}
              className="OrganizationSection__AllClients"
            >
              {searchText?.length > 2 ? (
                organizationsList &&
                organizationsList?.results?.length &&
                organizationsList?.query === searchText ? (
                  organizationsList?.results?.map((item, key) => (
                    <Grid key={key} item xs={3}>
                      <ClientCard
                        setAction={setAction}
                        setOrganization={setOrganization}
                        row={item}
                        refetch={refetch}
                        id={item.id}
                        name={item.name}
                        logo={item.appearance.logo}
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
                      marginLeft: "50%",
                      marginTop: "20%",
                    }}
                  >
                    <h2>{searching}</h2>
                  </div>
                )
              ) : organizationList && organizationList?.length ? (
                organizationList.map((item, key) => (
                  <Grid key={key} item xs={3}>
                    <ClientCard
                      setAction={setAction}
                      setOrganization={setOrganization}
                      row={item}
                      refetch={refetch}
                      id={item.id}
                      name={item.name}
                      logo={item.appearance.logo}
                    />
                  </Grid>
                ))
              ) : (
                <NoDataFound
                  title={noDataTitle}
                  description={noDataDescription}
                />
              )}
            </Grid>
            <OrganizationModal
              action={action}
              organization={organization}
              setOrganization={setOrganization}
              open={openAddClientModal}
              handleClose={handleClose}
              refetch={refetch}
            />
          </>
        ) : (
          <>{tabValue == 0 ? <ModalitySection /> : <SiteSection />}</>
        )}
      </Box>
    </>
  );
};
export default OrganizationSection;
