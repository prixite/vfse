import { useState } from "react";

import { Box, Grid } from "@mui/material";

import SiteCard from "@src/components/common/Presentational/SiteCard/SiteCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import { localizedData } from "@src/helpers/utils/language";

import "react-toastify/dist/ReactToastify.css";
import "@src/components/common/Smart/SiteSection/SiteSection.scss";

const sitesData = [
  {
    id: 3,
    logo: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
    name: "Advent Health Carrollwood",
    number_of_seats: null,
    machines: ["MRI-3", "CT-2"],
    connections: 6,
    location: "7171 N Dale Mabry Nwy",
  },
];

const SiteSection = () => {
  const [site, setSite] = useState(null);
  const [sitesList, setSitesList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

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
                    machines={item.machines}
                    location={item.location}
                    connections={item.connections}
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
                  machines={item.machines}
                  location={item.location}
                  connections={item.connections}
                />
              </Grid>
            ))
          ) : (
            <NoDataFound title={noDataTitle} description={noDataDescription} />
          )}
        </Grid>
        <OrganizationModal
          organization={site}
          setOrganization={setSite}
          open={open}
          handleClose={handleClose}
        />
      </Box>
    </>
  );
};
export default SiteSection;
