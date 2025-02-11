import {
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import debounce from "debounce";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import ColumnSelector from "@src/components/common/presentational/columnSelector/ColumnSelector";
import useStyles from "@src/components/common/smart/vfseTopSection/Styles";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsMeReadQuery,
  useOrganizationsSitesListQuery,
} from "@src/store/reducers/api";
import { openAddModal, openNetworkModal } from "@src/store/reducers/appStore";
import "@src/components/common/smart/topViewBtns/TopViewBtns.scss";
import { UserRole } from "@src/types/interfaces";

import FilterSelect from "./FilterSelect";
interface Props {
  path: string;
  setOpen?: (arg: boolean) => void;
  setData?: (arg: object) => void;
  networkFilter?: (arg: object) => void;
  siteFilter?: (arg: object) => void;
  setList?: (arg: { query: string; results?: { name: string }[] }) => void;
  actualData?: unknown;
  handleSearchQuery?: (arg: string) => void;
  searchText: string;
  setSearchText: (arg: string) => void;
  tableColumns?: {
    field: string;
    headerName: string;
    width: number;
    hide: boolean;
    disableColumnMenu: boolean;
  }[];
  setTableColumns?: (
    arg: {
      field: string;
      headerName: string;
      width: number;
      hide: boolean;
      disableColumnMenu: boolean;
    }[]
  ) => void;
  setAction?: Dispatch<SetStateAction<string>>;
  hasData?: boolean;
}

const TopViewBtns = ({
  path,
  setOpen,
  setData,
  setList,
  actualData,
  handleSearchQuery,
  searchText,
  setSearchText,
  networkFilter,
  tableColumns,
  setTableColumns,
  setAction,
  hasData,
}: Props) => {
  const { t } = useTranslation();
  const [browserWidth] = useWindowSize();
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location?.search);
  const dispatch = useAppDispatch();
  const [network, setNetwork] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [site, setSite] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");

  let btnAdd: string;
  if (path === "modality") {
    btnAdd = "Add Network";
  } else if (path === "organizations") {
    btnAdd = "Add Organization";
  } else if (path === "sites") {
    btnAdd = "Add Site";
  } else if (path === "users") {
    btnAdd = "Add User";
  } else if (path === "systems") {
    btnAdd = "Add System";
  } else if (path === "documentation") {
    btnAdd = "Add Document";
  } else if (path === "description") {
    btnAdd = "Add Document";
  } else if (path === "knowledge-base") {
    btnAdd = "Add Article";
  } else if (path === "knowledge-base-category") {
    btnAdd = "Add Category";
  } else if (path === "knowledge-base-folder") {
    btnAdd = "Add Folder";
  } else if (path === "activeUsers") {
    btnAdd = "Add User";
  }

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { id, siteId, networkId } = useParams();

  const { data: networksData, isLoading: isNetworkDataLoading } =
    useOrganizationsHealthNetworksListQuery({
      page: 1,
      id: id,
    });

  const { data: sitesData, isFetching: isSitesFetching } =
    useOrganizationsSitesListQuery({
      page: 1,
      id: id,
    });

  useEffect(() => {
    if (!isNetworkDataLoading && !networkId) {
      const networkParam = queryParams?.get("health_network");
      if (networkParam !== null && network.length == 0) {
        networkFilter(
          networksData?.filter((item) => networkParam == item?.id.toString())[0]
        );
        const list = networksData?.filter(
          (item) => networkParam == item?.id.toString()
        );
        if (list?.length) {
          setNetwork([list[0].name]);
        }
      }
    }
  }, [isNetworkDataLoading]);

  useEffect(() => {
    if (!isSitesFetching && !siteId) {
      const siteParam = queryParams?.get("site");
      if (siteParam !== null && site.length == 0) {
        const list = sitesData?.filter(
          (item) => siteParam == item?.id.toString()
        );
        if (list?.length) {
          setSite([list[0].name]);
        }
      }
    }
  }, [isSitesFetching]);

  const handleInput = (e: { target: { value: string } }) => {
    setSearchText(e.target.value);
  };

  const handleModal = () => {
    if (path === "users") {
      setOpen(true);
    } else if (path === "modality") {
      dispatch(openNetworkModal());
      setAction("add");
      setData(null);
    } else if (path === "systems") {
      setOpen(true);
      setData(null);
    } else if (path === "organizations") {
      setAction("add");
      dispatch(openAddModal());
      setData(null);
    } else if (path === "documentation") {
      setOpen(true);
      // setData(null);
    } else if (path === "knowledge-base") {
      setOpen(true);
    } else if (path === "knowledge-base-folder") {
      setOpen(true);
    } else if (path === "knowledge-base-category") {
      setOpen(true);
    } else {
      setOpen(true);
      setData(null);
    }
  };

  const handleFilterClick = (event, item, id) => {
    event.stopPropagation();
    const clickedItem = item.name;

    if (id === "network") {
      handleNetworkClick(clickedItem);
    } else if (id === "site") {
      handleSiteClick(clickedItem);
    }
  };

  const handleNetworkClick = (clickedNetwork) => {
    if (selectedNetwork === clickedNetwork) {
      setSelectedNetwork(null);
      queryParams.delete("selectedNetwork");
    } else {
      setSelectedNetwork(clickedNetwork);
      queryParams.set("selectedNetwork", clickedNetwork);
    }

    navigate(
      {
        search: queryParams.toString(),
      },
      { replace: true }
    );
  };

  const handleSiteClick = (clickedSite) => {
    if (selectedSite === clickedSite) {
      setSelectedSite(null);
      queryParams.delete("site");
    } else {
      setSelectedSite(clickedSite);
      queryParams.set("site", clickedSite);
    }

    navigate(
      {
        search: queryParams.toString(),
      },
      { replace: true }
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedNetworkParam = urlParams.get("selectedNetwork");
    const selectedSiteParam = urlParams.get("site");

    if (selectedNetworkParam) {
      setSelectedNetwork(selectedNetworkParam);
    }

    if (selectedSiteParam) {
      setSelectedSite(selectedSiteParam);
    }
  }, []);

  const onEventSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery?.length >= 1) {
        if (
          path === "users" ||
          path === "organizations" ||
          path === "modality" ||
          path === "sites"
        ) {
          handleSearchQuery(searchQuery);
        }
        const newList = { query: searchQuery, results: [] };
        searchQuery = searchQuery?.toLowerCase()?.trim();
        const result = actualData?.filter(
          (data: {
            username: string;
            product: { name: string };
            name: string;
          }) => {
            return path === "users"
              ? data?.username?.toLowerCase().trim().search(searchQuery) != -1
              : path === "documentation"
              ? data?.product?.name?.toLowerCase().trim().search(searchQuery) !=
                -1
              : data?.name?.toLowerCase().search(searchQuery) != -1;
          }
        );
        newList.results = result;
        setList(newList);
      }
    }, 500),
    [actualData]
  );

  useEffect(() => {
    onEventSearch(searchText);
  }, [searchText]);

  const createAddButton = () => {
    return (
      <Button
        style={{
          backgroundColor: buttonBackground,
          color: buttonTextColor,
        }}
        onClick={handleModal}
        variant="contained"
        className={`${classes.AddClientsbtn} btn-add`}
      >
        <div className={classes.btnContent}>
          <span style={{ paddingTop: 6 }}>
            <AddIcon />
          </span>
          <span className="show-hide">{btnAdd}</span>
        </div>
      </Button>
    );
  };

  const renderAddConditionally = () => {
    if (currentUser?.is_superuser) return true;
    if (
      path === "organizations" &&
      currentUser?.role == UserRole.CUSTOMER_ADMIN
    )
      return false;
    if (
      path === "knowledge-base" ||
      (path === "knowledge-base-category" && currentUser?.role == UserRole.FSE)
    )
      return false;
    if (path === "systems" && currentUser?.role !== UserRole.END_USER)
      return true;
    if (path !== "active-users" && currentUser?.role !== UserRole.END_USER)
      return true;
    return false;
  };

  return (
    <>
      <Box
        component="div"
        className="top-view-btns"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "23px",
          height: "47px",
          width: "100%",
        }}
      >
        <Box
          component="div"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            overflow: "visible",
          }}
        >
          <Box component="div" style={{ display: "flex", width: "100%" }}>
            {path === "systems" ? (
              <>
                {!isNetworkDataLoading && !networkId && networksData?.length ? (
                  <FilterSelect
                    label={t("Filter by network")}
                    id="network"
                    data={networksData}
                    selected={selectedNetwork}
                    handleClick={handleFilterClick}
                  />
                ) : (
                  ""
                )}
                {!isSitesFetching && !siteId && sitesData?.length ? (
                  <FilterSelect
                    label={t("Filter by site")}
                    id="site"
                    data={sitesData}
                    selected={selectedSite}
                    handleClick={handleFilterClick}
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}

            {path === "users" || (path === "documentation" && hasData) ? (
              <ColumnSelector
                className="columnSelector"
                tableColumns={tableColumns}
                setTableColumns={setTableColumns}
              />
            ) : (
              ""
            )}

            <TextField
              id="search-clients"
              className={classes.SearchInput}
              variant="outlined"
              value={searchText}
              autoComplete="off"
              onChange={handleInput}
              disabled={!actualData?.length}
              placeholder={browserWidth < 301 ? `` : `Search`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {renderAddConditionally() && !currentUser?.view_only
            ? createAddButton()
            : ""}
        </Box>
      </Box>
    </>
  );
};
export default TopViewBtns;
