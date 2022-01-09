import { useState } from "react";

import { Box, Grid } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import { closeAddModal } from "@src/store/reducers/appStore";

const OrganizationSection = () => {
  const dispatch = useAppDispatch();
  const { openAddClientModal } = useAppSelector((state) => state.app);
  const [organization, setOrganization] = useState(null);
  const [organizationsList, setOrganizationsList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [action,setAction] = useState("");
  const { data: organizationList, refetch } = useOrganizationsListQuery({
    page: 1,
  });

  const { title, noDataDescription, noDataTitle } =
    localizedData().organization;

  const handleClose = () => dispatch(closeAddModal());
  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>{title}</h2>
        <TopViewBtns
          path="organizations"
          setData={setOrganization}
          setList={setOrganizationsList}
          actualData={organizationList}
          searchText={searchText}
          setSearchText={setSearchText}
          setAction={setAction}
        />
        <Grid container spacing={2} className="OrganizationSection__AllClients">
          {searchText?.length > 2 ? (
            organizationsList &&
            organizationsList?.results?.length &&
            organizationsList?.query === searchText ? (
              organizationsList?.results?.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <ClientCard
                    setOrganization={setOrganization}
                    row={item}
                    refetch={refetch}
                    id={item.id}
                    name={item.name}
                    logo={item.logo}
                  />
                </Grid>
              ))
            ) : organizationsList?.query === searchText ? (
              <NoDataFound
                search
                setQuery={setSearchText}
                title={noDataTitle}
                description={noDataDescription}
              />
            ) : (
              ""
            )
          ) : organizationList && organizationList?.length ? (
            organizationList.map((item, key) => (
              <Grid key={key} item xs={3}>
                <ClientCard
                  setOrganization={setOrganization}
                  row={item}
                  refetch={refetch}
                  id={item.id}
                  name={item.name}
                  logo={item.appearance.logo}
                  setAction={setAction}
                />
              </Grid>
            ))
          ) : (
            <NoDataFound title={noDataTitle} description={noDataDescription} />
          )}
        </Grid>
        <OrganizationModal
          organization={organization}
          setOrganization={setOrganization}
          open={openAddClientModal}
          handleClose={handleClose}
          refetch={refetch}
          action={action}
        />
      </Box>
    </>
  );
};
export default OrganizationSection;
