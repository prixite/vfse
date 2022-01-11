import { useEffect, useCallback, Dispatch, SetStateAction } from "react";

import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import debounce from "debounce";

import ArrowDown from "@src/assets/svgs/arrow-long.svg";
import ArrowUpIcon from "@src/assets/svgs/arrow-up.svg";
import ColumnSelector from "@src/components/common/Presentational/ColumnSelector/ColumnSelector";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { HealthNetwork } from "@src/store/reducers/api";
import { openAddModal, openNetworkModal } from "@src/store/reducers/appStore";

interface Props {
  path: string;
  setOpen?: (arg: boolean) => void;
  setData: (arg: object) => void;
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
  tableColumns,
  setTableColumns,
  setAction,
}: Props) => {
  const dispatch = useAppDispatch();
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
  const { btnFilter, btnAdd } = constantData;

  const { btnAsset } = localizedData().systems;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

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
          <Button
            variant="contained"
            className="Filterbtn"
            disabled={!actualData?.length}
          >
            <div className="btn-content">
              <FilterAltIcon style={{ marginRight: "9px" }} />
              <span>{btnFilter}</span>
            </div>
          </Button>

          {path === "systems" ? (
            <Button variant="contained" className="Filterbtn">
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
                  <img className="asset-image" src={ArrowUpIcon} />
                </span>
              </div>
            </Button>
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
            <span>{btnAdd}</span>
          </div>
        </Button>
      </Box>
    </>
  );
};
export default TopViewBtns;
