import { useState } from "react";
import { Box, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import OrganizationModal from "@src/components/shared/popUps/OrganizationModal/OrganizationModal";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import SiteCard from "@src/components/common/Presentational/SiteCard/SiteCard";

const sitesData = [
    {
        id: 3,
        logo: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
        name: "Organization",
        number_of_seats: null,
        machines: ['MRI-3', 'CT-2'],
        connections: 6,
        location: '7171 N Dale Mabry Nwy'
    }
];

const SiteSection = () => {
  const [site, setSite] = useState(null);
  const [sitesList, setSitesList] = useState({});
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const constantData: any = localizedData()?.organization;
  const { title } = constantData;

  const handleClose = () => setOpen(false);


  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>{title}</h2>
        <TopViewBtns
          setOpen={setOpen}
          path="organizations"
          setData={setSite}
          setList={setSitesList}
          actualData={sitesData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Grid container spacing={2} className="OrganizationSection__AllClients">
          {searchText?.length > 2 ? (
            sitesList &&
            sitesList?.results?.length &&
            sitesList?.query === searchText ? (
                sitesList?.results?.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <SiteCard
                    name={item.name}
                    logo={item.logo}
                    machines={item.machines}
                    location={item.location}
                    connections={item.connections}
                  />
                </Grid>
              ))
            ) : sitesList?.query === searchText ? (
              <p style={{ marginTop: "20px", marginLeft: "20px" }}>
                no results found
              </p>
            ) : (
              ""
            )
          ) : sitesData && sitesData?.length ? (
            sitesData.map((item, key) => (
              <Grid key={key} item xs={3}>
                <SiteCard
                  name={item.name}
                  logo={item.logo}
                  machines={item.machines}
                  location={item.location}
                  connections={item.connections}
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
    </>
  );
};
export default SiteSection;
