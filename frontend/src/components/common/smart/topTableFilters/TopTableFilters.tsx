import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";

import ArrowDown from "@src/assets/svgs/arrow-long.svg";
import ArrowUpIcon from "@src/assets/svgs/arrow-up.svg";
import ColumnSelector from "@src/components/common/presentational/columnSelector/ColumnSelector";
import "@src/components/common/smart/topTableFilters/topTableFilters.scss";
import { localizedData } from "@src/helpers/utils/language";

interface Props {
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
}

const TopTableFilters = ({ tableColumns, setTableColumns }: Props) => {
  const { btnFilter, btnAsset } = localizedData().documentation;

  return (
    <>
      <Box component="div" className="TopTableFIlters__Header">
        <Box component="div" className="InputSection">
          <Button variant="contained" className="Filterbtn">
            <div className="btn-content">
              <FilterAltIcon style={{ marginRight: "9px" }} />
              <span>{btnFilter}</span>
            </div>
          </Button>
          <ColumnSelector
            tableColumns={tableColumns}
            setTableColumns={setTableColumns}
          />
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
      </Box>
    </>
  );
};
export default TopTableFilters;
