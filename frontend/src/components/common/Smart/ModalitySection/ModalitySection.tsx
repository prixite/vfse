import { useState } from "react";
import { Box, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import OrganizationModal from "@src/components/common/Smart/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import TopViewBtns from "@src/components/common/Presentational/TopViewBtns/TopViewBtns";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";

import "@src/components/common/Smart/ModalitySection/ModalitySection.scss";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { localizedData } from "@src/helpers/utils/language";

const ModalitySection = () => {
  const [network, setNetwork] = useState(null);
  const [open, setOpen] = useState(false);
  const constantData: any = localizedData()?.modalities;
  const { title } = constantData;

  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const { data: networksData, refetch: orgNetworkRefetch } =
    useOrganizationsHealthNetworksListQuery({
      page: 1,
      organizationPk: currentOrganization.id.toString(),
    });

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="div" className="ModalitySection">
        <h2>{title}</h2>
        <TopViewBtns
          setOpen={setOpen}
          path="modality"
          setData={setNetwork}
        />
        <Grid container spacing={2} className="ModalitySection__AllNetworks">
          {networksData &&
            networksData?.length &&
            networksData.map((item, key) => (
              <Grid key={key} item xs={3}>
                <ClientCard
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
        <OrganizationModal
          organization={network}
          setOrganization={setNetwork}
          open={open}
          handleClose={handleClose}
          refetch={orgNetworkRefetch}
        />
      </Box>
    </>
  );
};
export default ModalitySection;
