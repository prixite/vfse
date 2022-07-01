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
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import debounce from "debounce";
import { useNavigate, useParams } from "react-router-dom";

import ColumnSelector from "@src/components/common/presentational/columnSelector/ColumnSelector";
import useStyles from "@src/components/common/smart/vfseTopSection/Styles";
import { localizedData } from "@src/helpers/utils/language";
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
  siteFilter,
  tableColumns,
  setTableColumns,
  setAction,
  hasData,
}: Props) => {
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location?.search);
  const dispatch = useAppDispatch();
  const [network, setNetwork] = useState([]);
  const [site, setSite] = useState([]);
  let constantData: { btnFilter: string; btnAdd: string };
  if (path === "modality") {
    constantData = localizedData()?.modalities;
  } else if (path === "organizations") {
    constantData = localizedData()?.organization;
  } else if (path === "sites") {
    constantData = localizedData()?.sites;
  } else if (path == "users") {
    constantData = localizedData()?.users;
  } else if (path == "systems") {
    constantData = localizedData()?.systems;
  } else if (path == "documentation") {
    constantData = localizedData()?.documentation;
  } else if (path == "description") {
    constantData = localizedData()?.documentation;
  } else if (path == "knowledge-base") {
    constantData = localizedData()?.article;
  } else if (path == "knowledge-base-category") {
    constantData = localizedData()?.category;
  } else if (path == "knowledge-base-folder") {
    constantData = localizedData()?.folder;
  }
  const { btnAdd } = constantData;

  // const { btnAsset } = localizedData().systems;

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
      // setData(null);
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

  const dropdownStyles = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 220,
      },
    },
  };

  const handleClickNetwork = (event: {
    target: { outerText: string | unknown[] };
  }) => {
    if (event?.target?.outerText !== "") {
      if (network?.length && event?.target?.outerText == network) {
        setNetwork([]);
        networkFilter({});
        queryParams.delete("health_network");
        navigate(
          {
            search: queryParams.toString(),
          },
          { replace: true }
        );
      } else {
        queryParams.delete("health_network");
        setNetwork([event?.target?.outerText]);
        networkFilter(
          networksData?.filter((item) => event.target.outerText == item.name)[0]
        );
      }
    }
  };

  const handleClickSite = (event: {
    target: { outerText: string | unknown[] };
  }) => {
    if (event?.target?.outerText !== "") {
      if (site?.length && event?.target?.outerText == site) {
        setSite([]);
        siteFilter({});
        queryParams.delete("site");
        navigate(
          {
            search: queryParams.toString(),
          },
          { replace: true }
        );
      } else {
        setSite([event?.target?.outerText]);
        siteFilter(
          sitesData?.filter((item) => event?.target?.outerText == item?.name)[0]
        );
      }
    }
  };

  // const handleSort = () => {
  //   // sortSystems();
  // };

  const onEventSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery?.length > 2) {
        if (
          path === "users" ||
          path === "organizations" ||
          path === "modality" ||
          path === "sites"
        ) {
          handleSearchQuery(searchQuery);
        }
        const newList = { query: searchQuery, results: [] };
        const result = actualData?.filter(
          (data: {
            username: string;
            product: { name: string };
            name: string;
          }) => {
            return path === "users"
              ? data?.username
                  ?.toLowerCase()
                  .search(searchQuery?.toLowerCase()) != -1
              : path === "documentation"
              ? data?.product?.name
                  ?.toLowerCase()
                  .search(searchQuery?.toLowerCase()) != -1
              : data?.name?.toLowerCase().search(searchQuery?.toLowerCase()) !=
                -1;
          }
        );
        newList.results = result;
        setList(newList);
      }
    }, 500),
    []
  );

  useEffect(() => {
    onEventSearch(searchText);
  }, [searchText]);

  const createAddButton = () => {
    return (
      <Button
        sx={{
          backgroundColor: buttonBackground,
          color: buttonTextColor,
          height: "50px",
        }}
        size="large"
        onClick={handleModal}
        variant="contained"
        className={classes.AddClientsbtn}
        startIcon={<AddIcon />}
      >
        {btnAdd}
      </Button>
    );
  };

  return (
    <>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={6} md={2} lg={2}>
          {path === "users" || (path === "documentation" && hasData) ? (
            <ColumnSelector
              tableColumns={tableColumns}
              setTableColumns={setTableColumns}
            />
          ) : (
            ""
          )}
          {path === "systems" ? (
            <>
              {!isNetworkDataLoading && !networkId && networksData?.length ? (
                <FormControl
                  fullWidth
                  sx={{
                    background: "#ffffff",
                  }}
                >
                  <InputLabel
                    id="networkInputLabel"
                    style={{ marginTop: "-3px" }}
                  >
                    Filter by network
                  </InputLabel>
                  <Select
                    labelId="networks-dropdown"
                    id="network-dropdown"
                    defaultValue={[]}
                    value={network}
                    onClick={handleClickNetwork}
                    style={{ height: "47px" }}
                    input={<OutlinedInput label="Filter by network" />}
                    renderValue={(selected) => selected}
                    MenuProps={dropdownStyles}
                  >
                    <MenuItem
                      style={{ marginLeft: "-15px", display: "none" }}
                      value=""
                    >
                      <ListItemText primary={``} />
                    </MenuItem>
                    {networksData?.map((item, index) => (
                      <MenuItem
                        style={{ marginLeft: "-15px" }}
                        key={index}
                        value={item.name}
                      >
                        <Checkbox checked={network?.indexOf(item.name) > -1} />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )}
              {!isSitesFetching && !siteId && sitesData?.length ? (
                <FormControl
                  fullWidth
                  sx={{
                    background: "#ffffff",
                  }}
                >
                  <InputLabel id="siteInputlabel" style={{ marginTop: "-3px" }}>
                    Filter by site
                  </InputLabel>
                  <Select
                    labelId="site-dropdown"
                    id="site-dropdown"
                    value={site}
                    onClick={handleClickSite}
                    // style={{ width: "100%", height: "100%" }}
                    input={<OutlinedInput label="Filter by site" />}
                    renderValue={(selected) => selected}
                    MenuProps={dropdownStyles}
                  >
                    <MenuItem
                      style={{ marginLeft: "-15px", display: "none" }}
                      value=""
                    >
                      <ListItemText primary={``} />
                    </MenuItem>
                    {sitesData?.map((item, index) => (
                      <MenuItem
                        style={{ marginLeft: "-15px" }}
                        key={index}
                        value={item.name}
                      >
                        <Checkbox checked={site?.indexOf(item.name) > -1} />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </Grid>

        <Grid item xs={6} md={3} lg={3}>
          <TextField
            id="search-clients"
            className={classes.SearchInput}
            variant="outlined"
            value={searchText}
            // autoFocus={path === "organizations" ? true : false}
            autoComplete="off"
            onChange={handleInput}
            disabled={!actualData?.length}
            placeholder="Search"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={7}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {currentUser?.is_superuser &&
              path === "organizations" &&
              createAddButton()}
            {path !== "organizations" && createAddButton()}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default TopViewBtns;
