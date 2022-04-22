// import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/common/smart/vfseTopSection/vfseTopSection.scss";

interface Props {
  setOpen?: (arg: boolean) => void;
}
export default function VfseTopSection({ setOpen }: Props) {
  const [sort, setSort] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const [openSort, setOpenSort] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { btnCreateTopic } = localizedData().Forum;

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  const handleClose = () => {
    setOpenSort(false);
  };

  const handleOpen = () => {
    setOpenSort(true);
  };
  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleInput = (e) => {
    setSearchText(e.target.value);
  };
  const handleModal = () => {
    setOpen(true);
  };

  return (
    <>
      <Box className="rootSection">
        <Box component="div" style={{ display: "flex", width: "80%" }}>
          <div>
            <FormControl
              sx={{ m: 0, mr: 1, minWidth: 200, backgroundColor: "white" }}
              size="small"
            >
              <InputLabel id="sort-by-categoty">Sort by:</InputLabel>
              <Select
                labelId="sort-by-category-label"
                id="demo-controlled-open-select"
                open={openSort}
                onClose={handleClose}
                onOpen={handleOpen}
                value={sort}
                label="Sort"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl
              sx={{ m: 0, mr: 1, minWidth: 140, backgroundColor: "white" }}
              size="small"
            >
              <InputLabel id="filter-dropdown">Filter:</InputLabel>
              <Select
                labelId="filter-dropdown-label"
                id="filter-dropdown-select"
                open={openFilter}
                onClose={handleCloseFilter}
                onOpen={handleOpenFilter}
                value={filter}
                label="Filter"
                onChange={handleChangeFilter}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": {
                m: 0,
                mr: 1,
                width: "75ch",
                backgroundColor: "white",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="search-topics"
                size="small"
                className="Search-input"
                variant="outlined"
                value={searchText}
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
            </div>
          </Box>
        </Box>
        <div className="create-topic-btn">
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            variant="contained"
            className="AddTopicsbtn"
            onClick={handleModal}
          >
            <div className="btn-content">
              <AddIcon />
              <span>{btnCreateTopic}</span>
            </div>
          </Button>
        </div>
      </Box>
    </>
  );
}
