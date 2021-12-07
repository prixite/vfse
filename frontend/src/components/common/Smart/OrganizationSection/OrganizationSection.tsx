import { Box, Button, InputAdornment, TextField, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";
import OrganizationModal from "@src/components/common/Smart/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import "@src/components/common/Smart/OrganizationSection/OrganizationSection.scss";
import "react-toastify/dist/ReactToastify.css";
import {
  useOrganizationsListQuery,
  useOrganizationsDeleteMutation,
} from "@src/store/reducers/api";

const OrganizationSection = () => {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const { data: items, refetch, isLoading } = useOrganizationsListQuery();
  const [deleteOrganization] = useOrganizationsDeleteMutation();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>All Clients</h2>

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
