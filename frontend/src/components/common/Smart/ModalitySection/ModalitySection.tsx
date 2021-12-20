import { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import NetworkModal from "@src/components/shared/popUps/NetworkModal/NetworkModal";
import NetworkCard from "@src/components/common/Presentational/NetworkCard/NetworkCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Smart/ModalitySection/ModalitySection.scss";
import { localizedData } from "@src/helpers/utils/language";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";

const ModalitySection = () => {
  const [network, setNetwork] = useState(null);
  const [open, setOpen] = useState(false);
  const constantData: any = localizedData()?.modalities;
  const { title } = constantData;

  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const {
    data: networksData,
    isLoading: isNetworkDataLoading,
    refetch: orgNetworkRefetch,
  } = useOrganizationsHealthNetworksListQuery({
    page: 1,
    organizationPk: currentOrganization?.id.toString(),
  });

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="div" className="ModalitySection">
        <h2>{title}</h2>
        <TopViewBtns setOpen={setOpen} path="modality" setData={setNetwork} />
        <Grid container spacing={2} className="ModalitySection__AllNetworks">
          {networksData?.length
            ? networksData?.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <NetworkCard
                    setOpen={setOpen}
                    setOrganization={setNetwork}
                    row={item}
                    refetch={orgNetworkRefetch}
                    id={item.id}
                    name={item.name}
                    logo={item.appearance.logo}
                  />
                </Grid>
              ))
            : ""}
        </Grid>
        <NetworkModal open={open} handleClose={handleClose} />
      </Box>
      {!isNetworkDataLoading && !networksData?.length ? <NoDataFound /> : ""}
    </>
  );
};
export default ModalitySection;
