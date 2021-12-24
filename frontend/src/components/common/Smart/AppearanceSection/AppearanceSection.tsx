import React, { useState } from "react";
import "@src/components/common/Smart/AppearanceSection/AppearanceSection.scss";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import { compileOrganizationColorObject } from "@src/helpers/compilers/organization";
import {
  Organization,
  useOrganizationsListQuery,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import {
  updateSideBarColor,
  updateButtonColor,
  updateSideBarTextColor,
  updateButtonTextColor,
  updateFontOne,
  updateFontTwo,
} from "@src/store/reducers/themeStore";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import { updateOrganizationColor } from "@src/services/organizationService";
const AppearanceSection = () => {
  const [organizationsPartialUpdate] = useOrganizationsPartialUpdateMutation();
  const { refetch: refetchOrgList } = useOrganizationsListQuery({
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
    fontOne,
    fontTwo,
  } = useAppSelector((state) => state.myTheme);
  var currentOrganiationDummyData: Organization = JSON.parse(
    JSON.stringify(selectedOrganization)
  );
  const changeSideBarColor = (color: string) => {
    dispatch(updateSideBarColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "sidebar_color"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };

  const changeButtonColor = (color: string) => {
    dispatch(updateButtonColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "primary_color"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };

  const updateAppearance = async () => {
    setIsLoading((prevState) => true);
    await updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData,
      refetchOrgList
    );
  };

  const changeSideBarTextColor = (color: string) => {
    dispatch(updateSideBarTextColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "sidebar_text"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };

  const changeButtonTextColor = (color: string) => {
    dispatch(updateButtonTextColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "button_text"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };

  const onChangeFont = (event) => {
    dispatch(updateFontOne(event.target.value));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      event.target.value,
      "font_one"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };
  const onChangeFontTwo = (event) => {
    dispatch(updateFontTwo(event.target.value));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      event.target.value,
      "font_two"
    );
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
  };

  return (
    <Box component="div" className="AppearanceSection">
      <h2>{selectedOrganization?.name}</h2>
      <Box component="div" className="AppearanceSection__clientCard">
        <Box component="div" className="AppearanceSection__clientSection">
          <Box component="div" className="clientName">
            <h4 className="labels">Client Name</h4>
            <TextField
              disabled
              className="nameInput"
              placeholder={selectedOrganization?.name}
              variant="outlined"
            />
          </Box>
          <Box component="div" className="clientTheming">
            <Box component="div" className="clientLogo">
              <h4 className="labels">Logo</h4>
              <Box component="div" className="logo">
                <img src={selectedOrganization?.appearance?.logo} />
              </Box>
            </Box>
            <Box component="div" className="colorSection">
              <div style={{ display: "flex" }}>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Sidebar:"
                    color={sideBarBackground}
                    onChange={changeSideBarColor}
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons:"
                    color={buttonBackground}
                    onChange={changeButtonColor}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Sidebar Text:"
                    color={sideBarTextColor}
                    onChange={changeSideBarTextColor}
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons Text:"
                    color={buttonTextColor}
                    onChange={changeButtonTextColor}
                  />
                </div>
              </div>
            </Box>
          </Box>
          <Box component="div" className="clientFonts">
            <Box component="div" className="font-section">
              <h4 className="labels">Font #1</h4>
              <FormControl sx={{ minWidth: 195 }}>
                <Select
                  value={fontOne}
                  displayEmpty
                  onChange={onChangeFont}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                  <MenuItem value={"calibiri"}>Calibiri</MenuItem>
                  <MenuItem value={"ProximaNova-Regular"}>ProximaNova</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <h2 className="font-demo">AaBbCcDd</h2>
            <Box component="div" className="font-section">
              <h4 className="labels">Font #2</h4>
              <FormControl sx={{ minWidth: 195 }}>
                <Select
                  value={fontTwo}
                  displayEmpty
                  onChange={onChangeFontTwo}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                  <MenuItem value={"calibri"}>Calibri</MenuItem>
                  <MenuItem value={"ProximaNova-Regular"}>ProximaNova</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <h2 className="font-demo" style={{ fontFamily: `${fontTwo}` }}>
              AaBbCcDd
            </h2>
          </Box>
          <Button
            onClick={updateAppearance}
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            variant="contained"
            className="SaveAppearanceBtn"
            disabled={isLoading}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AppearanceSection;
