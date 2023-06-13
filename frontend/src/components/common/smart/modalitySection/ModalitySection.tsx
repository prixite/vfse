import { useState, useEffect } from "react";

import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import NetworkCard from "@src/components/common/presentational/networkCard/NetworkCard";
import "@src/components/common/smart/modalitySection/modalitySection.scss";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import NetworkModal from "@src/components/shared/popUps/networkModal/NetworkModal";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  HealthNetwork,
  useOrganizationsHealthNetworksListQuery,
} from "@src/store/reducers/api";
import { closeNetworkModal } from "@src/store/reducers/appStore";

const ModalitySection = () => {
  const { t } = useTranslation();
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
  const selectedOrganization = useSelectedOrganization();

  const { data: networksData, isLoading: isNetworkDataLoading } =
    useOrganizationsHealthNetworksListQuery({
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
        {networkId == undefined ? "" : <h2>{t("All Networks")}</h2>}
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
          ) : networksData && networksData?.length ? (
            networksData.map((item, key) => (
              <Grid key={key} item xs={6} xl={3} md={4}>
                <NetworkCard
                  setAction={setAction}
                  setOpen={setOpen}
                  setOrganization={setNetwork}
                  row={item}
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
          />
        ) : (
          ""
        )}
      </Box>
      {!isNetworkDataLoading && !networksData?.length ? (
        <NoDataFound
          title={t("Sorry! No results found. :(")}
          description={t("Try Again")}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default ModalitySection;
