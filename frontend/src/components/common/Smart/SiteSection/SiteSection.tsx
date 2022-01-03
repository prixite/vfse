import { useState } from "react";

import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import SiteCard from "@src/components/common/Presentational/SiteCard/SiteCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import { localizedData } from "@src/helpers/utils/language";
import { useOrganizationsSitesListQuery } from "@src/store/reducers/api";
import "react-toastify/dist/ReactToastify.css";
import "@src/components/common/Smart/SiteSection/SiteSection.scss";

const SiteSection = () => {
  const [site, setSite] = useState(null);
  const [sitesList, setSitesList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const { networkId } = useParams();

  const {
    data: sitesData,
    isFetching: isSitesFetching,
    // refetch: sitesRefetch,
  } = useOrganizationsSitesListQuery({
    page: 1,
    id: networkId.toString(),
  });

  const { title, noDataTitle, noDataDescription } = localizedData().sites;

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="div" className="SiteSection">
        <h2>{title}</h2>
        <TopViewBtns
          setOpen={setOpen}
          path="sites"
          setData={setSite}
          setList={setSitesList}
          actualData={sitesData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Grid container spacing={2} className="SiteSection__AllClients">
          {searchText?.length > 2 ? (
            sitesList &&
            sitesList?.results?.length &&
            sitesList?.query === searchText ? (
              sitesList?.results?.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <SiteCard
                    name={item.name}
                    machines={item.modalities}
                    location={item.address}
                    connections={6}
                  />
                </Grid>
              ))
            ) : sitesList?.query === searchText ? (
              <NoDataFound
                search
                setQuery={setSearchText}
                title={noDataTitle}
                description={noDataDescription}
              />
            ) : (
              ""
            )
          ) : sitesData && sitesData?.length ? (
            sitesData.map((item, key) => (
              <Grid key={key} item xs={3}>
                <SiteCard
                  name={item.name}
                  machines={item.modalities}
                  location={item.address}
                  connections={6}
                />
              </Grid>
            ))
          ) : (
            ""
          )}
        </Grid>
        <OrganizationModal
          organization={site}
          setOrganization={setSite}
          open={open}
          handleClose={handleClose}
        />
      </Box>
      {!isSitesFetching && !sitesData?.length ? (
        <NoDataFound title={noDataTitle} description={noDataDescription} />
      ) : (
        ""
      )}
    </>
  );
};
export default SiteSection;
