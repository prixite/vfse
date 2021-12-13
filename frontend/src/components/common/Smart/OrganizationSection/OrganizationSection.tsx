import { useState } from "react";
import { Box, Button, InputAdornment, TextField, Grid } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "react-toastify/dist/ReactToastify.css";
import OrganizationModal from "@src/components/common/Smart/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import {
  useOrganizationsListQuery,
  useOrganizationsDeleteMutation,
  useOrganizationsPartialUpdateMutation,
  Organization,
} from "@src/store/reducers/api";
import {
  updateSideBarColor,
  updateButtonColor,
  updateSideBarTextColor,
  updateButtonTextColor,
} from "@src/store/reducers/themeStore";
import { setCurrentOrganization } from "@src/store/reducers/organizationStore";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { compileOrganizationColorObject } from "@src/helpers/compilers/organization";
import { localizedData } from "@src/helpers/utils/language";
import { updateOrganizationColor } from "@src/services/organizationService";

const OrganizationSection = () => {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const { data: items, refetch, isLoading } = useOrganizationsListQuery();
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const [organizationsPartialUpdate] = useOrganizationsPartialUpdateMutation();

  const constantData: any = localizedData()?.organization;
  const { allClients, btnFilter, btnAddClients } = constantData;

  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
  } = useAppSelector((state) => state.myTheme);
  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );
  const dispatch = useAppDispatch();
  const handleClose = () => setOpen(false);

  var currentOrganiationDummyData: Organization = JSON.parse(
    JSON.stringify(currentOrganization)
  );

  function changeSideBarColor(color: string) {
    dispatch(updateSideBarColor(color));
    if (!isLoading) {
      currentOrganiationDummyData = compileOrganizationColorObject(
        currentOrganiationDummyData,
        color,
        "sidebar_color"
      );
      dispatch(
        setCurrentOrganization({
          currentOrganization: currentOrganiationDummyData,
        })
      );
      updateOrganizationColor(
        organizationsPartialUpdate,
        currentOrganiationDummyData
      );
    }
  }

  function changeButtonColor(color: string) {
    dispatch(updateButtonColor(color));
    if (!isLoading) {
      currentOrganiationDummyData = compileOrganizationColorObject(
        currentOrganiationDummyData,
        color,
        "primary_color"
      );
      dispatch(
        setCurrentOrganization({
          currentOrganization: currentOrganiationDummyData,
        })
      );
      updateOrganizationColor(
        organizationsPartialUpdate,
        currentOrganiationDummyData
      );
    }
  }

  function changeSideBarTextColor(color: string) {
    dispatch(updateSideBarTextColor(color));
    if (!isLoading) {
      currentOrganiationDummyData = compileOrganizationColorObject(
        currentOrganiationDummyData,
        color,
        "sidebar_text"
      );
      dispatch(
        setCurrentOrganization({
          currentOrganization: currentOrganiationDummyData,
        })
      );
      updateOrganizationColor(
        organizationsPartialUpdate,
        currentOrganiationDummyData
      );
    }
  }

  function changeButtonTextColor(color: string) {
    dispatch(updateButtonTextColor(color));
    if (!isLoading) {
      currentOrganiationDummyData = compileOrganizationColorObject(
        currentOrganiationDummyData,
        color,
        "button_text"
      );
      dispatch(
        setCurrentOrganization({
          currentOrganization: currentOrganiationDummyData,
        })
      );
      updateOrganizationColor(
        organizationsPartialUpdate,
        currentOrganiationDummyData
      );
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>{allClients}</h2>
        <div style={{ display: "flex" }}>
          <div style={{ marginTop: "20px" }}>
            <ColorPicker
              title="Sidebar:"
              color={sideBarBackground}
              onChange={changeSideBarColor}
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "20px" }}>
            <ColorPicker
              title="Buttons:"
              color={buttonBackground}
              onChange={changeButtonColor}
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "20px" }}>
            <ColorPicker
              title="Sidebar Text:"
              color={sideBarTextColor}
              onChange={changeSideBarTextColor}
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "20px" }}>
            <ColorPicker
              title="Buttons Text:"
              color={buttonTextColor}
              onChange={changeButtonTextColor}
            />
          </div>
        </div>
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
