import { useState } from "react";
import { Box, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import NetworkModal from "@src/components/shared/popUps/NetworkModal/NetworkModal";
import NetworkCard from "@src/components/common/Presentational/NetworkCard/NetworkCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";

import "@src/components/common/Smart/ModalitySection/ModalitySection.scss";
import { localizedData } from "@src/helpers/utils/language";

const ModalitySection = () => {
  const [network, setNetwork] = useState(null);
  const [open, setOpen] = useState(false);
  const constantData: any = localizedData()?.modalities;
  const { title } = constantData;

  const { data: networksData, refetch: orgNetworkRefetch } =
    useOrganizationsHealthNetworksListQuery({
      page: 1,
      organizationPk: "3",
    });

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="div" className="ModalitySection">
        <h2>{title}</h2>
        <TopViewBtns setOpen={setOpen} path="modality" setData={setNetwork} />
        <Grid container spacing={2} className="ModalitySection__AllNetworks">
          {networksData &&
            networksData?.length &&
            networksData.map((item, key) => (
              <Grid key={key} item xs={3}>
                <NetworkCard
                  setOpen={setOpen}
                  setOrganization={setNetwork}
                  row={item}
                  refetch={orgNetworkRefetch}
                  id={item.id}
                  name={item.name}
                  logo={item.logo}
                />
              </Grid>
            ))}
        </Grid>
        <NetworkModal open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};
export default ModalitySection;
