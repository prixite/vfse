import { useState, useEffect } from "react";

import "@src/components/common/smart/appearanceSection/appearanceSection.scss";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import ColorPicker from "@src/components/common/presentational/colorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import { AppearanceFormState } from "@src/components/shared/popUps/systemModalInterfaces/interfaces";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
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

const initialState: AppearanceFormState = {
  sidebarColor: "",
  sidebarContentColor: "",
  buttonColor: "",
  buttonContentColor: "",
  secondColor: "",
  sideBarFont: "",
  mainContentFont: "",
};
const AppearanceSection = () => {
  const [updateOrganization, { isLoading }] =
    useOrganizationsPartialUpdateMutation();
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

  const formik = useFormik({
    initialValues: initialState,
    onSubmit: () => {
      updateAppearance();
    },
  });

  useEffect(() => {
    formik.setValues({
      sidebarColor: sideBarBackground,
      sidebarContentColor: sideBarTextColor,
      buttonColor: buttonBackground,
      buttonContentColor: buttonTextColor,
      secondColor: secondaryColor,
      sideBarFont: fontTwo,
      mainContentFont: fontOne,
    });
  }, []);

  const updateAppearance = async () => {
    dispatch(updateSideBarColor(formik.values.sidebarColor));
    dispatch(updateSideBarTextColor(formik.values.sidebarContentColor));
    dispatch(updateButtonColor(formik.values.buttonColor));
    dispatch(updateButtonTextColor(formik.values.buttonContentColor));
    dispatch(updateSecondaryColor(formik.values.secondColor));
    dispatch(updateFontOne(formik.values.mainContentFont));
    dispatch(updateFontTwo(formik.values.sideBarFont));

    let currentOrganiationDummyData: Organization = JSON.parse(
      JSON.stringify(selectedOrganization)
    );

    [
      ["sidebarColor", "sidebar_color"],
      ["buttonColor", "primary_color"],
      ["sidebarContentColor", "sidebar_text"],
      ["secondColor", "secondary_color"],
      ["buttonContentColor", "button_text"],
      ["mainContentFont", "font_one"],
      ["sideBarFont", "font_two"],
    ].forEach(
      ([formField, color]) =>
        (currentOrganiationDummyData.appearance[color] =
          formik.values[formField])
    );

    dispatch(
      setSelectedOrganization({
        selectedOrganization: currentOrganiationDummyData,
      })
    );

    if (selectedImage && selectedImage.length) {
      currentOrganiationDummyData = await uploadImageToS3(selectedImage[0])
        .then((data: S3Interface) => {
          const tempData = JSON.parse(
            JSON.stringify(currentOrganiationDummyData)
          );
          tempData.appearance["banner"] = data?.location;
          tempData.appearance["logo"] = data?.location;
          tempData.appearance["icon"] = data?.location;
          dispatch(
            setSelectedOrganization({
              selectedOrganization: tempData,
            })
          );
          return tempData;
        })
        .catch(() => currentOrganiationDummyData); // eslint-disable-line no-unused-vars
    }

    try {
      await updateOrganization({
        id: currentOrganiationDummyData.id.toString(),
        organization: currentOrganiationDummyData,
      }).unwrap();
      toast.success("Client successfully updated");
    } catch {
      toast.error("Error updating client");
    }
  };

  return (
    <Box component="div" className="AppearanceSection">
      <h2>{selectedOrganization?.name}</h2>
      <Box component="div" className="AppearanceSection__clientCard">
        <Box component="div" className="clientName">
          <h4 className="labels">Client Name</h4>
          <TextField
            disabled
            className="nameInput"
            placeholder={selectedOrganization?.name}
            variant="outlined"
          />
        </Box>
        <Box
          component="div"
          className="AppearanceSection__clientSection"
          style={{ marginTop: "10px" }}
        >
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
                    color={formik.values.sidebarColor}
                    onChange={(color) =>
                      formik.setFieldValue("sidebarColor", color)
                    }
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons:"
                    color={formik.values.buttonColor}
                    onChange={(color) =>
                      formik.setFieldValue("buttonColor", color)
                    }
                  />
                </div>
              </div>
              <div className="container">
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Sidebar Text:"
                    color={formik.values.sidebarContentColor}
                    onChange={(color) =>
                      formik.setFieldValue("sidebarContentColor", color)
                    }
                  />
                </div>
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Buttons Text:"
                    color={formik.values.buttonContentColor}
                    onChange={(color) =>
                      formik.setFieldValue("buttonContentColor", color)
                    }
                  />
                </div>
              </div>
              <div className="container">
                <div className="appearanceColorSection">
                  <ColorPicker
                    title="Secondary Color:"
                    color={formik.values.secondColor}
                    onChange={(color) =>
                      formik.setFieldValue("secondColor", color)
                    }
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
                    value={formik.values.mainContentFont}
                    name="mainContentFont"
                    displayEmpty
                    onChange={formik.handleChange}
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
                style={{ fontFamily: `${formik.values.mainContentFont}` }}
              >
                AaBbCcDd
              </h2>
            </div>
            <div className="font-wrapper">
              <Box component="div" className="font-section">
                <h4 className="labels">{newOrganizationFont2}</h4>
                <FormControl sx={{ minWidth: 195 }}>
                  <Select
                    value={formik.values.sideBarFont}
                    name="sideBarFont"
                    displayEmpty
                    onChange={formik.handleChange}
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
                style={{ fontFamily: `${formik.values.sideBarFont}` }}
              >
                AaBbCcDd
              </h2>
            </div>
          </Box>
          <form onSubmit={formik.handleSubmit} className="forum">
            <Button
              type="submit"
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
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default AppearanceSection;
