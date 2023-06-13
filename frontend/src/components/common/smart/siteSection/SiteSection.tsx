import { useState, useEffect } from "react";

import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import SiteCard from "@src/components/common/presentational/siteCard/SiteCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import SiteModal from "@src/components/shared/popUps/siteModal/SiteModal";
import { useOrganizationsSitesListQuery, Site } from "@src/store/reducers/api";
import "react-toastify/dist/ReactToastify.css";
import "@src/components/common/smart/siteSection/siteSection.scss";

const SiteSection = () => {
  const { t } = useTranslation();
  const [site, setSite] = useState(null); // eslint-disable-line
  const [sitesList, setSitesList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [itemsList, setItemsList] = useState<Array<Site>>([]);

  const { id, networkId } = useParams();
  const selectionID =
    networkId == undefined ? id?.toString() : networkId?.toString();

  const { data: sitesData, isFetching: isSitesFetching } =
    useOrganizationsSitesListQuery({
      id: selectionID,
    });

  const handleClose = () => setOpen(false);
  const handleSearchQuery = (searchQuery: string) => {
    setItemsList(
      sitesData?.filter((site) => {
        return (
          site?.name?.toLowerCase().search(searchQuery?.toLowerCase()) != -1
        );
      })
    );
  };
  useEffect(() => {
    if (searchText?.length > 2 && sitesData && sitesData?.length) {
      handleSearchQuery(searchText);
    } else if (sitesData?.length && searchText?.length <= 2) {
      setItemsList(sitesData);
    }
  }, [searchText, sitesData]);

  return (
    <>
      <Box component="div" className="SiteSection">
        {networkId == undefined ? "" : <h2>{t("All Sites")}</h2>}
        {!isSitesFetching ? (
          <TopViewBtns
            setOpen={setOpen}
            path="sites"
            setData={setSite}
            setList={setSitesList}
            handleSearchQuery={handleSearchQuery}
            actualData={sitesData}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        ) : (
          ""
        )}
        {!isSitesFetching && !sitesData?.length ? (
          <NoDataFound
            title={t("Sorry! No results found. :(")}
            description={t("Try Again")}
          />
        ) : (
          <Grid container spacing={2} className="SiteSection__AllClients">
            {searchText?.length > 2 ? (
              itemsList && itemsList.length ? (
                itemsList.map((item, key) => (
                  <Grid key={key} item xs={3}>
                    <SiteCard
                      siteId={item?.id}
                      name={item?.name}
                      machines={item?.modalities}
                      location={item?.address}
                      connections={item?.connections}
                      sites={sitesData}
                    />
                  </Grid>
                ))
              ) : sitesList?.query === searchText ? (
                <NoDataFound
                  search
                  setQuery={setSearchText}
                  queryText={searchText}
                  title={t("Sorry! No results found. :(")}
                  description={t("Try Again")}
                />
              ) : (
                <div
                  style={{ color: "gray", marginLeft: "45%", marginTop: "20%" }}
                >
                  <h2>{t("Searching...")}</h2>
                </div>
              )
            ) : sitesData && sitesData?.length ? (
              sitesData.map((item, key) => (
                <Grid key={key} item xs={6} xl={3} md={4}>
                  <SiteCard
                    siteId={item?.id}
                    name={item?.name}
                    machines={item?.modalities}
                    location={item?.address}
                    connections={item?.connections}
                    sites={sitesData}
                  />
                </Grid>
              ))
            ) : (
              ""
            )}
          </Grid>
        )}
        {open ? (
          <SiteModal
            open={open}
            action={"add"}
            selectionID={selectionID}
            handleClose={handleClose}
          />
        ) : (
          ""
        )}
      </Box>
    </>
  );
};
export default SiteSection;
