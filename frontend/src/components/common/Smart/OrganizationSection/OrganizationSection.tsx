import { useState } from "react";
import { Box, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { localizedData } from "@src/helpers/utils/language";
import { openAddModal, closeAddModal } from "@src/store/reducers/appStore";

const OrganizationSection = () => {
  const dispatch = useAppDispatch();
  const { openAddClientModal } = useAppSelector((state) => state.app);
  const [organization, setOrganization] = useState(null);
  const [organizationsList, setOrganizationsList] = useState({});
  const [searchText, setSearchText] = useState("");
  const { data: organizationList, refetch } = useOrganizationsListQuery({
    page: 1,
  });

  const constantData: any = localizedData()?.organization;
  const { title } = constantData;

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
              <p style={{ marginTop: "20px", marginLeft: "20px" }}>
                no results found
              </p>
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
                />
              </Grid>
            ))
          ) : (
            ""
          )}
        </Grid>
        <OrganizationModal
          organization={organization}
          setOrganization={setOrganization}
          open={openAddClientModal}
          handleClose={handleClose}
          refetch={refetch}
        />
      </Box>
    </>
  );
};
export default OrganizationSection;
