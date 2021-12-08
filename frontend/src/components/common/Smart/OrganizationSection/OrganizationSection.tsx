import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, InputAdornment, TextField, Grid } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "rc-color-picker/assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import ColorPicker from "rc-color-picker";
import OrganizationModal from "@src/components/common/Smart/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import {
  useOrganizationsListQuery,
  useOrganizationsDeleteMutation,
} from "@src/store/reducers/api";
import {
  updateSideBarColor,
  updateButtonColor,
} from "@src/store/reducers/themeStore";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";

const OrganizationSection = () => {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const { sideBarBackground, buttonBackground } = useSelector(
    (state: any) => state.myTheme
  );
  const dispatch = useDispatch();
  const { data: items, refetch, isLoading } = useOrganizationsListQuery();
  const [deleteOrganization] = useOrganizationsDeleteMutation();

  const handleClose = () => setOpen(false);

  function changeSideBarColor(colors) {
    dispatch(updateSideBarColor({ color: colors.color }));
  }

  function changeButtonColor(colors) {
    dispatch(updateButtonColor({ color: colors.color }));
  }

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>All Clients</h2>
        <div style={{ display: "flex" }}>
          <div style={{ marginTop: "20px" }}>
            <h4>Sidebar: </h4>
            <ColorPicker
              animation="slide-up"
              color={sideBarBackground}
              onChange={changeSideBarColor}
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "20px" }}>
            <h4>Buttons: </h4>
            <ColorPicker
              animation="slide-up"
              color={buttonBackground}
              onChange={changeButtonColor}
            />
          </div>
        </div>
        <Box component="div" className="OrganizationSection__Header">
          <Box component="div" className="InputSection">
            <Button variant="contained" className="Filterbtn">
              <div className="btn-content">
                <FilterAltIcon style={{ marginRight: "9px" }} />
                <span>Filter</span>
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
            style={{ backgroundColor: buttonBackground }}
            onClick={() => {
              setOpen(true);
              setOrganization(null);
            }}
            variant="contained"
            className="AddClientsbtn"
          >
            <div className="btn-content">
              <AddIcon />
              <span>Add Clients</span>
            </div>
          </Button>
        </Box>
        <Grid container spacing={2} className="OrganizationSection__AllClients">
          {items.map((item, key) => (
            <Grid key={key} item xs={3}>
              <ClientCard
                setOpen={setOpen}
                setOrganization={setOrganization}
                row={item}
                deleteOrganization={deleteOrganization}
                refetch={refetch}
                id={item.id}
                name={item.name}
                logo={item.logo}
                key={key}
              />
            </Grid>
          ))}
        </Grid>
        <OrganizationModal
          organization={organization}
          setOrganization={setOrganization}
          open={open}
          handleClose={handleClose}
          refetch={refetch}
        />
      </Box>
    </>
  );
};
export default OrganizationSection;
