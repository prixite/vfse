import { useState, useEffect } from "react";

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
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import { updateOrganizationColor } from "@src/services/organizationService";
import {
  useAppSelector,
  useAppDispatch,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  Organization,
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
  const [sidebarColor, setSideBarColor] = useState("");
  const [sidebarContentColor, setSidebarContentColor] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [buttonContentColor, setButtonContentColor] = useState("");
  const [secondColor, setSecondColor] = useState("");
  const [sideBarFont, setSideBarFont] = useState("");
  const [mainContentFont, setMainContentFont] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const { newOrganizationFont1, newOrganizationFont2 } =
    localizedData().organization.popUp;
  const dispatch = useAppDispatch();
  const selectedOrganization = useSelectedOrganization();
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

  useEffect(() => {
    setSideBarColor(sideBarBackground);
    setSidebarContentColor(sideBarTextColor);
    setButtonColor(buttonBackground);
    setButtonContentColor(buttonTextColor);
    setSecondColor(secondaryColor);
    setMainContentFont(fontOne);
    setSideBarFont(fontTwo);
  }, []);

  const compileOrganization = () => {
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      sidebarColor,
      "sidebar_color"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      buttonColor,
      "primary_color"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      sidebarContentColor,
      "sidebar_text"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      secondColor,
      "secondary_color"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      buttonContentColor,
      "button_text"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      mainContentFont,
      "font_one"
    );
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      sideBarFont,
      "font_two"
    );
  };
  const changeSideBarColor = (color: string) => {
    setSideBarColor(color);
  };

  const changeButtonColor = (color: string) => {
    setButtonColor(color);
  };

  const updateAppearance = async () => {
    setIsLoading(true);
    dispatch(updateSideBarColor(sidebarColor));
    dispatch(updateSideBarTextColor(sidebarContentColor));
    dispatch(updateButtonColor(buttonColor));
    dispatch(updateButtonTextColor(buttonContentColor));
    dispatch(updateSecondaryColor(secondColor));
    dispatch(updateFontOne(mainContentFont));
    dispatch(updateFontTwo(sideBarFont));
    compileOrganization();
    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );
    if (selectedImage && selectedImage.length) {
      currentOrganiationDummyData = await uploadImageToS3(selectedImage[0])
        .then((data: S3Interface) => {
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
      currentOrganiationDummyData
    );
    setIsLoading(false);
  };

  const changeSideBarTextColor = (color: string) => {
    setSidebarContentColor(color);
  };

  const changeSecondaryColor = (color: string) => {
    setSecondColor(color);
  };

  const changeButtonTextColor = (color: string) => {
    setButtonContentColor(color);
  };

  const onChangeFont = (event) => {
    setMainContentFont(event.target.value);
  };
  const onChangeFontTwo = (event) => {
    setSideBarFont(event.target.value);
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
                  selectedImage={selectedImage}
                  imgSrc={selectedOrganization?.appearance?.logo}
                />
              </Box>
            </Box>
            <Box component="div" className="colorSection">
              <div className="container">
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Sidebar:"
                    color={sidebarColor}
                    onChange={changeSideBarColor}
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons:"
                    color={buttonColor}
                    onChange={changeButtonColor}
                  />
                </div>
              </div>
              <div className="container">
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Sidebar Text:"
                    color={sidebarContentColor}
                    onChange={changeSideBarTextColor}
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons Text:"
                    color={buttonContentColor}
                    onChange={changeButtonTextColor}
                  />
                </div>
              </div>
              <div className="container">
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Secondary Color:"
                    color={secondColor}
                    onChange={changeSecondaryColor}
                  />
                </div>
              </div>
            </Box>
          </Box>
          <Box component="div" className="clientFonts">
            <div className="font-wrapper">
              <Box component="div" className="font-section">
                <h4 className="labels">{newOrganizationFont1}</h4>
                <FormControl sx={{ minWidth: 195 }}>
                  <Select
                    value={mainContentFont}
                    displayEmpty
                    onChange={onChangeFont}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                    <MenuItem value={"calibri"}>Calibiri</MenuItem>
                    <MenuItem value={"ProximaNova-Regular"}>
                      ProximaNova
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <h2
                className="font-demo"
                style={{ fontFamily: `${mainContentFont}` }}
              >
                AaBbCcDd
              </h2>
            </div>
            <div className="font-wrapper">
              <Box component="div" className="font-section">
                <h4 className="labels">{newOrganizationFont2}</h4>
                <FormControl sx={{ minWidth: 195 }}>
                  <Select
                    value={sideBarFont}
                    displayEmpty
                    onChange={onChangeFontTwo}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                    <MenuItem value={"calibri"}>Calibri</MenuItem>
                    <MenuItem value={"ProximaNova-Regular"}>
                      ProximaNova
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <h2
                className="font-demo"
                style={{ fontFamily: `${sideBarFont}` }}
              >
                AaBbCcDd
              </h2>
            </div>
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
