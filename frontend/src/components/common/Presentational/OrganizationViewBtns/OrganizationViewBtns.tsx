import { useState } from "react";
import { Box, Button, InputAdornment, TextField, Grid } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { useAppSelector } from "@src/store/hooks";
import { localizedData } from "@src/helpers/utils/language";

const OrganizationViewBtns = () => {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const constantData: any = localizedData()?.organization;
  const { btnFilter, btnAddClients } = constantData;

  const {
    buttonBackground,
    buttonTextColor,
  } = useAppSelector((state) => state.myTheme);

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
              setOrganization(null);
            }}
            variant="contained"
            className="AddClientsbtn"
          >
            <div className="btn-content">
              <AddIcon />
              <span>{btnAddClients}</span>
            </div>
          </Button>
        </Box>
    </>
  );
};
export default OrganizationViewBtns;
