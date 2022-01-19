import { useState } from "react";

import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import SiteCard from "@src/components/common/Presentational/SiteCard/SiteCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import SiteModal from "@src/components/shared/popUps/SiteModal/SiteModal";
import { localizedData } from "@src/helpers/utils/language";
import { useOrganizationsSitesListQuery } from "@src/store/reducers/api";
import "react-toastify/dist/ReactToastify.css";
import "@src/components/common/Smart/SiteSection/SiteSection.scss";

const SiteSection = () => {
  const [site, setSite] = useState(null); // eslint-disable-line
  const [sitesList, setSitesList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const { id, networkId } = useParams();
  const selectionID =
    networkId == undefined ? id?.toString() : networkId?.toString();

  const {
    data: sitesData,
    isFetching: isSitesFetching,
    refetch: sitesRefetch,
  } = useOrganizationsSitesListQuery({
    page: 1,
    id: selectionID,
  });

  const { title, noDataTitle, noDataDescription } = localizedData().sites;
  const { searching } = localizedData().common;
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="div" className="SiteSection">
        {networkId == undefined ? "" : <h2>{title}</h2>}
        {!isSitesFetching ? (
          <TopViewBtns
            setOpen={setOpen}
            path="sites"
            setData={setSite}
            setList={setSitesList}
            actualData={sitesData}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        ) : (
          ""
        )}
        {!isSitesFetching && !sitesData?.length ? (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
        ) : (
          <Grid container spacing={2} className="SiteSection__AllClients">
            {searchText?.length > 2 ? (
              sitesList &&
              sitesList?.results?.length &&
              sitesList?.query === searchText ? (
                sitesList?.results?.map((item, key) => (
                  <Grid key={key} item xs={3}>
                    <SiteCard
                      siteId={item.id}
                      name={item.name}
                      machines={item.modalities}
                      location={item.address}
                      connections={6}
                      refetch={sitesRefetch}
                      sites={sitesData}
                    />
                  </Grid>
                ))
              ) : sitesList?.query === searchText ? (
                <NoDataFound
                  search
                  setQuery={setSearchText}
                  queryText={searchText}
                  title={noDataTitle}
                  description={noDataDescription}
                />
              ) : (
                <div
                  style={{ color: "gray", marginLeft: "45%", marginTop: "20%" }}
                >
                  <h2>{searching}</h2>
                </div>
              )
            ) : sitesData && sitesData?.length ? (
              sitesData.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <SiteCard
                    siteId={item.id}
                    name={item.name}
                    machines={item.modalities}
                    location={item.address}
                    connections={6}
                    refetch={sitesRefetch}
                    sites={sitesData}
                  />
                </Grid>
              ))
            ) : (
              ""
            )}
          </Grid>
        )}
        <SiteModal
          open={open}
          action={"add"}
          selectionID={selectionID}
          handleClose={handleClose}
          refetch={sitesRefetch}
        />
      </Box>
    </>
  );
};
export default SiteSection;
