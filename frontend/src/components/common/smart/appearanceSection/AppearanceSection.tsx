import { useState, useEffect } from "react";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Grid,
} from "@mui/material";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import ColorPicker from "@src/components/common/presentational/colorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import { AppearanceFormState } from "@src/components/shared/popUps/systemModalInterfaces/interfaces";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
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
  const { t } = useTranslation();
  const [updateOrganization, { isLoading }] =
    useOrganizationsPartialUpdateMutation();
  const [selectedImage, setSelectedImage] = useState([]);

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
      toast.success("Client successfully updated.");
    } catch (err) {
      toastAPIError("Error updating client", err.status, err.data);
    }
  };

  return (
    <>
      <Box component="div">
        <h2>{selectedOrganization?.name}</h2>
        <Box component="div" sx={{ background: "#fff", mt: "23px" }} p={4}>
          <Grid container>
            <Grid item>
              <h4 style={{ marginBottom: "5px" }}>{t("Client Name")}</h4>
              <TextField
                disabled
                fullWidth
                label={selectedOrganization?.name}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              lg={4}
              mt={2}
              mb={5}
              style={{ height: "163px" }}
            >
              <h4 style={{ marginBottom: "6px" }}>{t("Logo")}</h4>
              <DropzoneBox
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                imgSrc={selectedOrganization?.appearance?.logo}
              />
            </Grid>
            <Grid item xs={12} md={8} lg={8} mt={2}>
              <Grid container spacing={1} rowSpacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ColorPicker
                    title={`${"Sidebar"}:`}
                    color={formik.values.sidebarColor}
                    onChange={(color) =>
                      formik.setFieldValue("sidebarColor", color)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ColorPicker
                    title={`${"Buttons"}:`}
                    color={formik.values.buttonColor}
                    onChange={(color) =>
                      formik.setFieldValue("buttonColor", color)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ColorPicker
                    title={`${"Sidebar Text"}:`}
                    color={formik.values.sidebarContentColor}
                    onChange={(color) =>
                      formik.setFieldValue("sidebarContentColor", color)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ColorPicker
                    title={`${"Buttons Text"}:`}
                    color={formik.values.buttonContentColor}
                    onChange={(color) =>
                      formik.setFieldValue("buttonContentColor", color)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ColorPicker
                    title={`${"Secondary Color"}:`}
                    color={formik.values.secondColor}
                    onChange={(color) =>
                      formik.setFieldValue("secondColor", color)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container mt={3} rowSpacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={6} md={6} lg={6}>
                  <h4 style={{ marginBottom: "5px" }}>{t("Main content:")}</h4>
                  <FormControl fullWidth>
                    <Select
                      value={formik.values.mainContentFont}
                      name="mainContentFont"
                      displayEmpty
                      onChange={formik.handleChange}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"helvetica"}>{t("Helvetica")}</MenuItem>
                      <MenuItem value={"calibri"}>{t("Calibiri")}</MenuItem>
                      <MenuItem value={"ProximaNova-Regular"}>
                        {t("ProximaNova")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <h2
                    style={{
                      fontFamily: `${formik.values.mainContentFont}`,
                      paddingTop: "17px",
                    }}
                  >
                    {t("AaBbCcDd")}
                  </h2>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={6} md={6} lg={6}>
                  <h4 style={{ marginBottom: "5px" }}>
                    {t("Sidebar content:")}
                  </h4>
                  <FormControl fullWidth>
                    <Select
                      value={formik.values.sideBarFont}
                      name="sideBarFont"
                      displayEmpty
                      onChange={formik.handleChange}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"helvetica"}>{t("Helvetica")}</MenuItem>
                      <MenuItem value={"calibri"}>{t("Calibiri")}</MenuItem>
                      <MenuItem value={"ProximaNova-Regular"}>
                        {t("ProximaNova")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={4} lg={4}>
                  <h2
                    style={{
                      fontFamily: `${formik.values.sideBarFont}`,
                      paddingTop: "17px",
                    }}
                  >
                    {t("AaBbCcDd")}
                  </h2>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container mt={5}>
            <Grid item>
              <form onSubmit={formik.handleSubmit}>
                <Button
                  type="submit"
                  size="large"
                  style={
                    isLoading
                      ? {
                          backgroundColor: "gray",
                          color: "black",
                          width: "156px",
                        }
                      : {
                          backgroundColor: buttonBackground,
                          color: buttonTextColor,
                          width: "156px",
                        }
                  }
                  variant="contained"
                  disabled={isLoading}
                >
                  {t("Save")}
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default AppearanceSection;
