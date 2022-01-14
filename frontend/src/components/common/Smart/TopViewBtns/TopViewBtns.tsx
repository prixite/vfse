import {
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import AddIcon from "@mui/icons-material/Add";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import debounce from "debounce";
import { useHistory, useParams } from "react-router-dom";

import ArrowDown from "@src/assets/svgs/arrow-long.svg";
// import ArrowUpIcon from "@src/assets/svgs/arrow-up.svg";
import ColumnSelector from "@src/components/common/Presentational/ColumnSelector/ColumnSelector";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import "@src/components/common/Smart/TopViewBtns/TopViewBtns.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  HealthNetwork,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
} from "@src/store/reducers/api";
import { openAddModal, openNetworkModal } from "@src/store/reducers/appStore";

interface Props {
  path: string;
  setOpen?: (arg: boolean) => void;
  setData: (arg: object) => void;
  networkFilter: (arg: object) => void;
  siteFilter: (arg: object) => void;
  setList: (arg: { query: string; results?: { name: string }[] }) => void;
  actualData: HealthNetwork[];
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
}

const TopViewBtns = ({
  path,
  setOpen,
  setData,
  setList,
  actualData,
  searchText,
  setSearchText,
  networkFilter,
  siteFilter,
  tableColumns,
  setTableColumns,
  setAction,
}: Props) => {
  const history = useHistory();
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
  }
  const { btnAdd } = constantData;

  const { btnAsset } = localizedData().systems;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { id, siteId, networkId } = useParams();

  const { data: networksData, isLoading: isNetworkDataLoading } =
    useOrganizationsHealthNetworksListQuery({
      page: 1,
      id: id,
    });

  if (!isNetworkDataLoading && !networkId) {
    const networkParam = queryParams?.get("health_network");
    if (networkParam !== null && network.length == 0) {
      const list = networksData?.filter(
        (item) => networkParam == item?.id.toString()
      );
      if (list?.length) {
        setNetwork([list[0].name]);
      }
    }
  }

  const { data: sitesData, isFetching: isSitesFetching } =
    useOrganizationsSitesListQuery({
      page: 1,
      id: id,
    });

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

  const handleInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleModal = () => {
    if (path === "users") {
      setOpen(true);
      setData(null);
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

  const handleClickNetwork = (event) => {
    if (event?.target?.outerText !== "") {
      if (network?.length && event?.target?.outerText == network) {
        setNetwork([]);
        networkFilter({});
        queryParams.delete("health_network");
        history.replace({
          search: queryParams.toString(),
        });
      } else {
        setNetwork(event?.target?.outerText);
        networkFilter(
          networksData?.filter((item) => event.target.outerText == item.name)[0]
        );
      }
    }
  };

  const handleClickSite = (event) => {
    if (event?.target?.outerText !== "") {
      if (site?.length && event?.target?.outerText == site) {
        setSite([]);
        siteFilter({});
        queryParams.delete("site");
        history.replace({
          search: queryParams.toString(),
        });
      } else {
        setSite(event?.target?.outerText);
        siteFilter(
          sitesData?.filter((item) => event?.target?.outerText == item?.name)[0]
        );
      }
    }
  };

  const handleSort = () => {
    // sortSystems();
  };

  const onEventSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery?.length > 2) {
        const newList = { query: searchQuery, results: [] };
        const result = actualData?.filter((data) => {
          return path === "users"
            ? data?.username
                ?.toLowerCase()
                .search(searchQuery?.toLowerCase()) != -1
            : data?.name?.toLowerCase().search(searchQuery?.toLowerCase()) !=
                -1;
        });
        newList.results = result;
        setList(newList);
      }
    }, 500),
    []
  );

  useEffect(() => {
    onEventSearch(searchText);
  }, [searchText]);

  return (
    <>
      <Box component="div" className="OrganizationSection__Header">
        <Box component="div" className="InputSection">
          {/* <Button
            variant="contained"
            className="Filterbtn"
            disabled={!actualData?.length}
          >
            <div className="btn-content">
              <FilterAltIcon style={{ marginRight: "9px" }} />
              <span>{btnFilter}</span>
            </div>
          </Button> */}

          {path === "systems" ? (
            <>
              {!isNetworkDataLoading && !networkId && networksData.length ? (
                <FormControl
                  sx={{ m: 0, mr: 1, width: 220, background: "#ffffff" }}
                >
                  <InputLabel id="networkInputLabel">
                    Filter by network
                  </InputLabel>
                  <Select
                    labelId="networks-dropdown"
                    id="network-dropdown"
                    value={network}
                    onClick={handleClickNetwork}
                    style={{ width: 220 }}
                    input={<OutlinedInput label="Filter by network" />}
                    renderValue={(selected) => selected}
                    MenuProps={dropdownStyles}
                  >
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
              {!isSitesFetching && !siteId && sitesData.length ? (
                <FormControl
                  sx={{ m: 0, mr: 1, width: 220, background: "#ffffff" }}
                >
                  <InputLabel id="siteInputlabel">Filter by site</InputLabel>
                  <Select
                    labelId="site-dropdown"
                    id="site-dropdown"
                    value={site}
                    onClick={handleClickSite}
                    style={{ width: 220 }}
                    input={<OutlinedInput label="Filter by site" />}
                    renderValue={(selected) => selected}
                    MenuProps={dropdownStyles}
                  >
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
              <Button
                variant="contained"
                className="Filterbtn"
                onClick={handleSort}
              >
                <div className="btn-content" style={{ textTransform: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "11px",
                    }}
                  >
                    <span style={{ height: "10px" }}>0</span>
                    <span>9</span>
                  </div>
                  <img src={ArrowDown} style={{ marginRight: "10px" }} />
                  <span>{btnAsset}</span>
                  <span className="coloumns-icon">
                    {/* <img className="asset-image" src={ArrowUpIcon} /> */}
                  </span>
                </div>
              </Button>
            </>
          ) : (
            ""
          )}

          {path == "users" ? (
            <ColumnSelector
              tableColumns={tableColumns}
              setTableColumns={setTableColumns}
            />
          ) : (
            ""
          )}

          <TextField
            id="search-clients"
            className="Search-input"
            variant="outlined"
            value={searchText}
            // autoFocus={path === "organizations" ? true : false}
            onChange={handleInput}
            disabled={!actualData?.length}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={handleModal}
          variant="contained"
          className="AddClientsbtn"
        >
          <div className="btn-content">
            <AddIcon />
            <span style={{ display: "inline-block", paddingTop: "3px" }}>
              {btnAdd}
            </span>
          </div>
        </Button>
      </Box>
    </>
  );
};
export default TopViewBtns;
