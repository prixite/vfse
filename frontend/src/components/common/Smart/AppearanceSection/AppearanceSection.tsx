import { useState } from "react";

import "@src/components/common/Smart/AppearanceSection/AppearanceSection.scss";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { Buffer } from "buffer";

import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import { compileOrganizationColorObject } from "@src/helpers/compilers/organization";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { updateOrganizationColor } from "@src/services/organizationService";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import {
  Organization,
  useOrganizationsListQuery,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import {
  updateSideBarColor,
  updateButtonColor,
  updateSideBarTextColor,
  updateButtonTextColor,
  updateSecondaryColor,
  updateFontOne,
  updateFontTwo,
} from "@src/store/reducers/themeStore";

window.Buffer = window.Buffer || Buffer;
const AppearanceSection = () => {
  const [organizationsPartialUpdate] = useOrganizationsPartialUpdateMutation();
  const { refetch: refetchOrgList } = useOrganizationsListQuery({
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const dispatch = useAppDispatch();
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
    secondaryColor,
    fontOne,
    fontTwo,
  } = useAppSelector((state) => state.myTheme);
  let currentOrganiationDummyData: Organization = JSON.parse(
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
    setIsLoading(true);
    if (selectedImage && selectedImage.length) {
      currentOrganiationDummyData = await uploadImageToS3(selectedImage[0])
        .then((data) => {
          currentOrganiationDummyData.appearance.banner = data?.location;
          currentOrganiationDummyData.appearance.logo = data?.location;
          currentOrganiationDummyData.appearance.icon = data?.location;
          dispatch(
            setSelectedOrganization({
              selectedOrganization: currentOrganiationDummyData,
            })
          );
          return currentOrganiationDummyData;
        })
        .catch(() => currentOrganiationDummyData); // eslint-disable-line no-unused-vars
    }
    await updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData,
      refetchOrgList
    );
    setIsLoading(false);
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

  const changeSecondaryColor = (color: string) => {
    dispatch(updateSecondaryColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "secondary_color"
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
                <DropzoneBox
                  setSelectedImage={setSelectedImage}
                  imgSrc={selectedOrganization?.appearance?.logo}
                />
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
              <div style={{ display: "flex" }}>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Secondary Color:"
                    color={secondaryColor}
                    onChange={changeSecondaryColor}
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
                  <MenuItem value={"calibri"}>Calibiri</MenuItem>
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
            style={
              isLoading
                ? {
                    backgroundColor: "gray",
                    color: "black",
                  }
                : {
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }
            }
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
