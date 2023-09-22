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
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
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
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [site, setSite] = useState([]);
  const [selectedSite, setSelectedSite] = useState([]);
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

  const handleClick = (event, item) => {
    event.stopPropagation(); 

    const clickedNetwork = item.name;

    if (selectedNetwork === clickedNetwork) {
      setNetwork([]);
      networkFilter({});
      queryParams.delete("health_network");
      navigate(
        {
          search: queryParams.toString(),
        },
        { replace: true }
      );
      setSelectedNetwork(null);
    } else {
      queryParams.delete("health_network");
      setNetwork([clickedNetwork]);
      networkFilter(
        networksData?.filter((item) => clickedNetwork === item.name)[0]
      );
      setSelectedNetwork(clickedNetwork);
    }
  };

  const handleClickSite = (event, item) => {
    event.stopPropagation(); 

    const clickedSite = item.name;

    if (selectedSite.includes(clickedSite)) {
      setSite([]);
      siteFilter({});
      queryParams.delete("site");
      navigate(
        {
          search: queryParams.toString(),
        },
        { replace: true }
      );
      setSelectedSite([]);
    } else {
      setSite([clickedSite]);
      siteFilter(
        sitesData?.filter((item) => clickedSite === item.name)[0]
      );
      setSelectedSite([clickedSite]);
    }
  };

  // const handleSort = () => {
  //   // sortSystems();
  // };

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
    if (path === "organizations" && currentUser?.is_superuser) return true;
    if (path === "systems" && currentUser?.role !== "end-user") return true;
    if (path !== "active-users" && currentUser?.role !== "end-user")
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
              <FormControl
      sx={{
        m: 0,
        mr: 1,
        maxWidth: "30%",
        minWidth: "26%",
        background: "#ffffff",
      }}
    >
      <InputLabel id="networkInputLabel" style={{ marginTop: "-3px" }}>
        {t("Filter by network")}
      </InputLabel>
      <Select
        labelId="networks-dropdown"
        id="network-dropdown"
        defaultValue={[]}
        value={network}
        style={{ width: "100%", height: "100%" }}
        input={<OutlinedInput label={"Filter by network"} />}
        renderValue={(selected) => selected}
        MenuProps={dropdownStyles}
      >
        <MenuItem style={{ display: "none" }} value="">
          <ListItemText primary={``} />
        </MenuItem>
        {networksData?.map((item, index) => (
          <MenuItem
            key={index}
            value={item.name}
            onClick={(event) => handleClick(event, item)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={selectedNetwork === item.name}
                onClick={(event) => handleClick(event, item)}
              />
              <label onClick={(event) => handleClick(event, item)}>
                <ListItemText primary={item.name} />
              </label>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
                ) : (
                  ""
                )}
                {!isSitesFetching && !siteId && sitesData?.length ? (
       <FormControl
       sx={{
         m: 0,
         mr: 1,
         maxWidth: "30%",
         minWidth: "26%",
         background: "#ffffff",
       }}
     >
       <InputLabel id="siteInputlabel" style={{ marginTop: "-3px" }}>
         {t("Filter by site")}
       </InputLabel>
       <Select
         labelId="site-dropdown"
         id="site-dropdown"
         defaultValue={[]}
         value={site}
         style={{ width: "100%", height: "100%" }}
         input={<OutlinedInput label={"Filter by site"} />}
         renderValue={(selected) => selected}
         MenuProps={dropdownStyles}
       >
         <MenuItem style={{ display: "none" }} value="">
           <ListItemText primary={``} />
         </MenuItem>
         {sitesData?.map((item, index) => (
           <MenuItem
             key={index}
             value={item.name}
             onClick={(event) => handleClickSite(event, item)}
           >
             <div style={{ display: "flex", alignItems: "center" }}>
               <Checkbox
                 checked={selectedSite.includes(item.name)}
                 onClick={(event) => handleClickSite(event, item)}
               />
               <label onClick={(event) => handleClickSite(event, item)}>
                 <ListItemText primary={item.name} />
               </label>
             </div>
           </MenuItem>
         ))}
       </Select>
     </FormControl>
                ) : (
                  ""
                )}
                {/* SORT BY ASSET BUTTON.............. */}
                {/* <Button
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
                {/* </span>
                </div>
              </Button> */}
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
              // autoFocus={path === "organizations" ? true : false}
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