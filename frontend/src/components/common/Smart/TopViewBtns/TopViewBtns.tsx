import { useEffect, useCallback } from "react";

import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import debounce from "debounce";

import ColumnSelector from "@src/components/common/Presentational/ColumnSelector/ColumnSelector";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { openAddModal } from "@src/store/reducers/appStore";

interface Props {
  path: string;
  setOpen: (arg: boolean) => void;
  setData: (arg: object) => void;
  setList: (arg: { query: string; results?: { name: string }[] }) => void;
  actualData: { name: string }[];
  searchText: string;
  setSearchText: (arg: string) => void;
  tableColumns: {
    field: string;
    headerName: string;
    width: number;
    hide: boolean;
    disableColumnMenu: boolean;
  }[];
  setTableColumns: (
    arg: {
      field: string;
      headerName: string;
      width: number;
      hide: boolean;
      disableColumnMenu: boolean;
    }[]
  ) => void;
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
  }
  const { btnFilter, btnAdd } = constantData;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const handleInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleModal = () => {
    if (path !== "organizations") {
      setOpen(true);
      setData(null);
    } else {
      dispatch(openAddModal());
      setData(null);
    }
  };

  const onEventSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery?.length > 2) {
        const newList = { query: searchQuery, results: [] };
        const result = actualData?.filter((data) => {
          return (
            data?.name?.toLowerCase().search(searchQuery?.toLowerCase()) != -1
          );
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
