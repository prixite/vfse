import { useEffect, useCallback } from "react";
import { Box, Button, InputAdornment, TextField, Grid } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "debounce";
import AddIcon from "@mui/icons-material/Add";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { useAppSelector } from "@src/store/hooks";
import { localizedData } from "@src/helpers/utils/language";
import { useOrganizationsListQuery } from "@src/store/reducers/api";

const TopViewBtns = ({
  setOpen,
  path,
  setData,
  setOrganizationsList,
  searchText,
  setSearchText,
}) => {
  let constantData: any;
  if (path == "modality") {
    constantData = localizedData()?.modalities;
  } else if (path == "organizations") {
    constantData = localizedData()?.organization;
  }

  const { btnFilter, btnAdd } = constantData;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { data: organizationList } = useOrganizationsListQuery({
    page: 1,
  });

  const handleInput = (e) => {
    setSearchText(e.target.value);
  };

  const onEventSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery?.length > 2) {
        const organizations = { query: searchQuery };
        const result = organizationList?.filter((data) => {
          return (
            data?.name?.toLowerCase().search(searchQuery?.toLowerCase()) != -1
          );
        });
        organizations.results = result;
        setOrganizationsList(organizations);
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
          <Button variant="contained" className="Filterbtn">
            <div className="btn-content">
              <FilterAltIcon style={{ marginRight: "9px" }} />
              <span>{btnFilter}</span>
            </div>
          </Button>

          <TextField
            id="search-clients"
            className="Search-input"
            variant="outlined"
            onChange={handleInput}
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
          onClick={() => {
            setOpen(true);
            setData(null);
          }}
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
