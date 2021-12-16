import { useState } from "react";
import { Box, Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import OrganizationModal from "@src/components/common/Smart/OrganizationModal/OrganizationModal";
import ClientCard from "@src/components/common/Presentational/ClientCard/ClientCard";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import TopViewBtns from "@src/components/common/Presentational/TopViewBtns/TopViewBtns";
import {
  useOrganizationsCustomersListQuery,
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
  const [organizationsPartialUpdate] = useOrganizationsPartialUpdateMutation();
  const { data: organizationList, refetch } = useOrganizationsCustomersListQuery({
    page: 1,
  });
  const constantData: any = localizedData()?.organization;
  const { title } = constantData;

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

  function changeButtonColor(color: string) {
    dispatch(updateButtonColor(color));
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

  function changeSideBarTextColor(color: string) {
    dispatch(updateSideBarTextColor(color));
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

  function changeButtonTextColor(color: string) {
    dispatch(updateButtonTextColor(color));
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

  return (
    <>
      <Box component="div" className="OrganizationSection">
        <h2>{title}</h2>
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
        <TopViewBtns
          setOpen={setOpen}
          path="organizations"
          setData={setOrganization}
        />
        <Grid container spacing={2} className="OrganizationSection__AllClients">
          {organizationList &&
            organizationList?.length &&
            organizationList.map((item, key) => (
              <Grid key={key} item xs={3}>
                <ClientCard
                  setOpen={setOpen}
                  setOrganization={setOrganization}
                  row={item}
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
