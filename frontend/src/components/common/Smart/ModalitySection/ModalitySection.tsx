import { useState } from "react";

import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import NetworkCard from "@src/components/common/Presentational/NetworkCard/NetworkCard";
import "@src/components/common/Smart/ModalitySection/ModalitySection.scss";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import NetworkModal from "@src/components/shared/popUps/NetworkModal/NetworkModal";
import { localizedData } from "@src/helpers/utils/language";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import { closeNetworkModal } from "@src/store/reducers/appStore";

const ModalitySection = () => {
  const [network, setNetwork] = useState(null);
  const { openAddNetworkModal } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  // Just suppressing eslint error; TODO: Use network.
  const [open, setOpen] = useState(false); // eslint-disable-line
  const { networkId } = useParams();
  // const setOpen = function () {
  //   return "fake";
  // };
  const [action, setAction] = useState("");
  const [networksList, setNetworksList] = useState({});
  const [searchText, setSearchText] = useState("");
  const { title, noDataTitle, noDataDescription } = localizedData().modalities;

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const {
    data: networksData,
    isLoading: isNetworkDataLoading,
    refetch: orgNetworkRefetch,
  } = useOrganizationsHealthNetworksListQuery({
    page: 1,
    id: selectedOrganization?.id.toString(),
  });

  const handleClose = () => dispatch(closeNetworkModal());

  return (
    <>
      <Box component="div" className="ModalitySection">
        {networkId == undefined ? "" : <h2>{title}</h2>}
        <TopViewBtns
          path="modality"
          setData={setNetwork}
          setList={setNetworksList}
          setAction={setAction}
          actualData={networksData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Grid container spacing={2} className="ModalitySection__AllNetworks">
          {searchText?.length > 2 ? (
            networksList &&
            networksList?.results?.length &&
            networksList?.query === searchText ? (
              networksList?.results?.map((item, key) => (
                <Grid key={key} item xs={3}>
                  <NetworkCard
                    setAction={setAction}
                    setOpen={setOpen}
                    setOrganization={setNetwork}
                    row={item}
                    refetch={orgNetworkRefetch}
                    networkId={item.id}
                    name={item.name}
                    logo={item?.appearance?.logo}
                    sitesCount={item?.sites?.length}
                  />
                </Grid>
              ))
            ) : networksList?.query === searchText ? (
              <NoDataFound
                search
                setQuery={setSearchText}
                title={noDataTitle}
                description={noDataDescription}
              />
            ) : (
              ""
            )
          ) : networksData && networksData?.length ? (
            networksData.map((item, key) => (
              <Grid key={key} item xs={3}>
                <NetworkCard
                  setAction={setAction}
                  setOpen={setOpen}
                  setOrganization={setNetwork}
                  row={item}
                  refetch={orgNetworkRefetch}
                  networkId={item.id}
                  name={item.name}
                  logo={item?.appearance?.logo}
                  sitesCount={item?.sites?.length}
                />
              </Grid>
            ))
          ) : (
            ""
          )}
        </Grid>
        {/* Umair: Disable this button because it is crashing. */}
        <NetworkModal
          organization={network}
          open={openAddNetworkModal}
          action={action}
          handleClose={handleClose}
          refetch={orgNetworkRefetch}
        />
      </Box>
      {!isNetworkDataLoading && !networksData?.length ? (
        <NoDataFound title={noDataTitle} description={noDataDescription} />
      ) : (
        ""
      )}
    </>
  );
};
export default ModalitySection;
