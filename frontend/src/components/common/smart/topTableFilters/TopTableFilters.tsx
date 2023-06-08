import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

import ArrowDown from "@src/assets/svgs/arrow-long.svg";
import ArrowUpIcon from "@src/assets/svgs/arrow-up.svg";
import ColumnSelector from "@src/components/common/presentational/columnSelector/ColumnSelector";
import "@src/components/common/smart/topTableFilters/topTableFilters.scss";

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
  const { t } = useTranslation();

  return (
    <>
      <Box component="div" className="TopTableFIlters__Header">
        <Box component="div" className="InputSection">
          <Button variant="contained" className="Filterbtn">
            <div className="btn-content">
              <FilterAltIcon style={{ marginRight: "9px" }} />
              <span>{t("Filter")}</span>
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
              <span>{t("Sort by Asset #")}</span>
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
