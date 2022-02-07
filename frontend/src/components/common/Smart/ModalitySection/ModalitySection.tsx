import { useState, useEffect } from "react";

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
import {
  HealthNetwork,
  useOrganizationsHealthNetworksListQuery,
} from "@src/store/reducers/api";
import { closeNetworkModal } from "@src/store/reducers/appStore";

const ModalitySection = () => {
  const [network, setNetwork] = useState(null);
  const [itemsList, setItemsList] = useState<Array<HealthNetwork>>([]);
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
  const { searching } = localizedData().common;
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const {
    data: networksData,
    isLoading: isNetworkDataLoading,
    refetch: orgNetworkRefetch,
  } = useOrganizationsHealthNetworksListQuery({
    id: selectedOrganization?.id.toString(),
  });

  const handleClose = () => dispatch(closeNetworkModal());
  const handleSearchQuery = (searchQuery: string) => {
    setItemsList(
      networksData?.filter((network) => {
        return (
          network?.name?.toLowerCase().search(searchQuery?.toLowerCase()) != -1
        );
      })
    );
  };
  useEffect(() => {
    if (searchText?.length > 2 && networksData && networksData?.length) {
      handleSearchQuery(searchText);
    } else if (networksData?.length && searchText?.length <= 2) {
      setItemsList(networksData);
    }
  }, [searchText, networksData]);
  return (
    <>
      <Box component="div" className="ModalitySection">
        {networkId == undefined ? "" : <h2>{title}</h2>}
        {!isNetworkDataLoading ? (
          <TopViewBtns
            path="modality"
            setData={setNetwork}
            setList={setNetworksList}
            setAction={setAction}
            actualData={networksData}
            handleSearchQuery={handleSearchQuery}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        ) : (
          ""
        )}
        <Grid container spacing={2} className="ModalitySection__AllNetworks">
          {searchText?.length > 2 ? (
            itemsList && itemsList.length ? (
              itemsList.map((item, key) => (
                <Grid key={key} item xs={6} xl={3} md={4}>
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
          ) : networksData && networksData?.length ? (
            networksData.map((item, key) => (
              <Grid key={key} item xs={6} xl={3} md={4}>
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
        {openAddNetworkModal ? (
          <NetworkModal
            organization={network}
            open={openAddNetworkModal}
            action={action}
            handleClose={handleClose}
            refetch={orgNetworkRefetch}
          />
        ) : (
          ""
        )}
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
