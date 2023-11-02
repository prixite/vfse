import { useState, useEffect } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Box, TextField, Select, MenuItem, FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import ColorPicker from "@src/components/common/presentational/colorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import HealthNetwork from "@src/components/common/presentational/healthNetwork/HealthNetwork";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import {
  updateOrganizationService,
  addNewOrganizationService,
  addNewHealthNetworksService,
} from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsHealthNetworksUpdateMutation,
  useOrganizationsHealthNetworksListQuery,
} from "@src/store/reducers/api";
import { S3Interface, OrganizationModalFormState } from "@src/types/interfaces";

import "@src/components/shared/popUps/organizationModal/organizationModal.scss";

window.Buffer = window.Buffer || Buffer;
const initialState: OrganizationModalFormState = {
  organizationName: "",
  organizationSeats: "",
  organizationLogo: "",
  networks: [{ name: "", appearance: { logo: "" } }],
  sidebarColor: "",
  sidebarTextColor: "",
  ButtonTextColor: "",
  ButtonColor: "",
  secondColor: "",
  fontone: "",
  fonttwo: "",
};
const validationSchema = yup.object({
  organizationName: yup.string().required("Name is required"),
  organizationLogo: yup.string().required("Image is not selected"),
  organizationSeats: yup.string().required("Seats is not selected"),
});
export default function OrganizationModal({
  action,
  organization,
  open,
  handleClose,
}) {
  const { t } = useTranslation();
  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const [page, setPage] = useState("");
  const [organizationID, setOrganizationID] = useState();
  const [selectedImage, setSelectedImage] = useState([]);
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addNewOrganization] = useOrganizationsCreateMutation();
  const [addNewNetworks] = useOrganizationsHealthNetworksUpdateMutation();
  const [isDataPartiallyfilled, setIsDataPartiallyfilled] = useState(false);
  const [isNetworkImageUploading, setIsNetworkImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: networksData,
    error,
    isLoading: isNetworkDataLoading,
  } = useOrganizationsHealthNetworksListQuery(
    {
      id: organizationID,
    },
    {
      skip: !organizationID,
    }
  );
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (action === "edit") {
        editClientModalActions();
      } else {
        addClientModalActions();
      }
    },
  });
  const resetModal = () => {
    setOnChangeValidation(false);
    handleClose();
    formik.resetForm();
    setSelectedImage([]);
  };

  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
    secondaryColor,
    fontOne,
    fontTwo,
  } = useAppSelector((state) => state.myTheme);

  useEffect(() => {
    if (open) {
      setOrganizationID(organization?.id);
      formik.setValues({
        ...formik.values,
        organizationName: organization?.name || "",
        organizationSeats: organization?.number_of_seats?.toString() || "",
        organizationLogo: organization?.appearance?.logo || "",
        sidebarColor:
          organization?.appearance?.sidebar_color || sideBarBackground,
        sidebarTextColor:
          organization?.appearance?.sidebar_text || sideBarTextColor,
        ButtonTextColor:
          organization?.appearance?.button_text || buttonTextColor,
        ButtonColor:
          organization?.appearance?.primary_color || buttonBackground,
        secondColor:
          organization?.appearance?.secondary_color || secondaryColor,
        fontone: organization?.appearance?.font_one || fontOne,
        fonttwo: organization?.appearance?.font_two || fontTwo,
      });
      if (action === "new") {
        setPage("2");
      } else {
        setPage("1");
      }
    }
  }, [organization, open]);

  const handleChange = (event) => {
    setPage(event.target.value);
  };

  const handleOrganizationSeats = (event) => {
    formik.setFieldValue(
      "organizationSeats",
      event.target.value.replace(/[^0-9]/g, "")
    );
  };
  const handleSetNewOrganization = async () => {
    setIsLoading(true);
    if (selectedImage.length && formik.isValid) {
      const organizationObject = getOrganizationObject();
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          organizationObject.appearance.banner = data?.location;
          organizationObject.appearance.logo = data?.location;
          organizationObject.appearance.icon = data?.location;
          if (organizationObject?.appearance.banner || organizationObject) {
            await addNewOrganizationService(
              organizationObject,
              addNewOrganization,
              setOrganizationID
            )
              .then(() => setPage("2"))
              .catch((error) =>
                toastAPIError(
                  "Error occurred while adding organization",
                  error?.status,
                  error.data
                )
              );
          }
        }
      );
    }
    setIsLoading(false);
  };

  const addClientModalActions = () => {
    if (page === "1") {
      handleSetNewOrganization();
    } else if (page === "2") {
      if (!validateEmptyNetwork()) {
        handleUpdateNetworks();
      } else {
        resetModal();
      }
    }
  };
  const handleUpdateOrganization = async () => {
    setIsLoading(true);
    if (selectedImage.length && formik.isValid) {
      const organizationObject = getOrganizationObject();
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          organizationObject.appearance.banner = data?.location;
          organizationObject.appearance.logo = data?.location;
          organizationObject.appearance.icon = data?.location;
          if (organizationObject?.appearance.banner || organizationObject) {
            await updateOrganizationService(
              organizationID,
              organizationObject,
              updateOrganization
            )
              .then(() => setPage("2"))
              .catch((error) =>
                toastAPIError(
                  "Error occurred while saving organization",
                  error?.status,
                  error.data
                )
              );
          }
        }
      );
    } else if (
      formik.values.organizationLogo &&
      formik.values.organizationName
    ) {
      const organizationObject = getOrganizationObject();
      if (organizationObject?.appearance.banner || organizationObject) {
        await updateOrganizationService(
          organizationID,
          organizationObject,
          updateOrganization
        )
          .then(() => setPage("2"))
          .catch((error) =>
            toastAPIError(
              "Error occurred while saving organization",
              error?.status,
              error.data
            )
          );
      }
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    const valid = formik.values.networks?.every((network) => {
      if (
        (network?.name === "" && network?.appearance?.logo !== "") ||
        (network?.name !== "" && network?.appearance?.logo === "") ||
        network?.name === formik.values.organizationName
      ) {
        return false;
      } else {
        return true;
      }
    });
    return valid;
  };
  const validateEmptyNetwork = () => {
    if (
      formik.values.networks?.length === 1 &&
      formik.values.networks[0]?.name === "" &&
      formik.values.networks[0]?.appearance?.logo === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const handleUpdateNetworks = async () => {
    if (validateForm() && formik.isValid) {
      setIsLoading(true);
      const TempNetworks = formik.values.networks.filter(
        (network) => network?.name && network?.appearance?.logo !== ""
      );
      if (!TempNetworks.length) {
        toastAPIError("Add Networks first");
      } else {
        await addNewHealthNetworksService(
          organizationID,
          addNewNetworks,
          TempNetworks
        ).then(() => {
          resetModal();
        });
      }

      setIsLoading(false);
    }
    setIsDataPartiallyfilled(true);
  };

  const editClientModalActions = () => {
    if (page === "1") {
      handleUpdateOrganization();
    } else if (page === "2") {
      if (!validateEmptyNetwork()) {
        handleUpdateNetworks();
      } else {
        resetModal();
      }
    }
  };

  const changeSideBarColor = (color: string) =>
    formik.setFieldValue("sidebarColor", color);

  const changeButtonColor = (color: string) =>
    formik.setFieldValue("ButtonColor", color);

  const changeSideBarTextColor = (color: string) =>
    formik.setFieldValue("sidebarTextColor", color);

  const changeButtonTextColor = (color: string) =>
    formik.setFieldValue("ButtonTextColor", color);

  const changeSecondaryColor = (color: string) =>
    formik.setFieldValue("secondColor", color);

  const addNetworks = () => {
    formik.setFieldValue("networks", [
      ...formik.values.networks,
      { name: "", appearance: { logo: "" } },
    ]);
    setIsDataPartiallyfilled(true);
  };

  const getOrganizationObject = () => {
    return {
      name: formik.values.organizationName,
      number_of_seats: formik.values.organizationSeats || null,
      appearance: {
        sidebar_text: formik.values.sidebarTextColor,
        button_text: formik.values.ButtonTextColor,
        sidebar_color: formik.values.sidebarColor,
        primary_color: formik.values.ButtonColor,
        secondary_color: formik.values.secondColor,
        font_one: formik.values.fontone,
        font_two: formik.values.fonttwo,
        banner: formik.values.organizationLogo,
        logo: formik.values.organizationLogo,
        icon: formik.values.organizationLogo,
      },
    };
  };
  useEffect(() => {
    if (selectedImage?.length) {
      formik.setFieldValue("organizationLogo", selectedImage[0]);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (open) {
      if (!isNetworkDataLoading && !error) {
        if (networksData && networksData.length && open) {
          formik.setFieldValue("networks", [...networksData]);
        }
        if (!(networksData && networksData.length) && open) {
          formik.setFieldValue("networks", [
            { name: "", appearance: { logo: "" } },
          ]);
        }
      }
    }
  }, [isNetworkDataLoading, networksData, error, open]);

  return (
    <Dialog className="organization-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {organization?.name ?? "Add Organization"}
          </span>
          <span className="dialog-page">
            {action !== "new" ? (
              <span className="pg-number">
                {`${"Step"} ${page} ${"of 2"}`}
                <span style={{ marginLeft: "16px" }}>
                  <Radio
                    checked={page === "1"}
                    disabled={action === "new" ? true : false}
                    onChange={handleChange}
                    value="1"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "1" }}
                    size="small"
                    sx={{
                      "&.Mui-checked": {
                        color: buttonBackground,
                      },
                    }}
                  />
                  <Radio
                    checked={page === "2"}
                    onChange={handleChange}
                    disabled={!organizationID}
                    value="2"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "2" }}
                    size="small"
                    sx={{
                      "&.Mui-checked": {
                        color: buttonBackground,
                      },
                    }}
                  />
                </span>
              </span>
            ) : (
              ""
            )}
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <>
              <div>
                <p className="dropzone-title required">{t("Logo")}</p>
                <DropzoneBox
                  imgSrc={formik.values.organizationLogo}
                  setSelectedImage={setSelectedImage}
                  selectedImage={selectedImage}
                />
                <p className="errorText">{formik.errors.organizationLogo}</p>
              </div>
              <div
                className="client-info"
                style={
                  formik.errors.organizationLogo
                    ? { marginTop: "15px" }
                    : { marginTop: "24px" }
                }
              >
                <div className="info-section">
                  <p className="info-label required">
                    {t("Organization Name")}
                  </p>
                  <TextField
                    name="organizationName"
                    value={formik.values.organizationName}
                    className="info-field"
                    variant="outlined"
                    placeholder="Advent Health"
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "15px" }}>
                    {formik.errors.organizationName}
                  </p>
                  <p
                    className="info-label required"
                    style={
                      formik.errors.organizationName
                        ? { marginTop: "10px" }
                        : { marginTop: "20px" }
                    }
                  >
                    {t("Number of Seats")}
                  </p>
                  <TextField
                    name=""
                    value={formik.values.organizationSeats}
                    className="info-field"
                    variant="outlined"
                    placeholder="6"
                    onChange={handleOrganizationSeats}
                  />
                  <p className="errorText" style={{ marginTop: "15px" }}>
                    {formik.errors.organizationSeats}
                  </p>
                  <div className="color-section">
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={"Sidebar:"}
                          color={formik.values.sidebarColor}
                          onChange={changeSideBarColor}
                        />
                      </div>
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={"Buttons:"}
                          color={formik.values.ButtonColor}
                          onChange={changeButtonColor}
                        />
                      </div>
                    </div>
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={t("Sidebar Text:")}
                          color={formik.values.sidebarTextColor}
                          onChange={changeSideBarTextColor}
                        />
                      </div>
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={t("Buttons Text:")}
                          color={formik.values.ButtonTextColor}
                          onChange={changeButtonTextColor}
                        />
                      </div>
                    </div>
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={`Secondary Color:`}
                          color={formik.values.secondColor}
                          onChange={changeSecondaryColor}
                        />
                      </div>
                    </div>
                  </div>

                  <h4 style={{ marginTop: "25px" }} className="labels">
                    {t("Main content:")}
                  </h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          name="fontone"
                          value={formik.values.fontone}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={formik.handleChange}
                        >
                          <MenuItem value={"helvetica"}>
                            {t("Helvetica")}
                          </MenuItem>
                          <MenuItem value={"calibri"}>{t("Calibri")}</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            {t("ProximaNova")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span
                      className="font-demo"
                      style={{ fontFamily: formik.values.fontone }}
                    >
                      {t("AaBbCcDd")}
                    </span>
                  </div>
                  <h4 className="labels">{t("Sidebar content:")}</h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          name="fonttwo"
                          value={formik.values.fonttwo}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={formik.handleChange}
                        >
                          <MenuItem value={"helvetica"}>
                            {t("Helvetica")}
                          </MenuItem>
                          <MenuItem value={"calibri"}>{t("Calibri")}</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            {t("ProximaNova")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span
                      className="font-demo"
                      style={{ fontFamily: formik.values.fonttwo }}
                    >
                      {t("AaBbCcDd")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="health-header">
                <span className="heading-txt">{t("Health networks")}</span>
                <div
                  style={{
                    cursor: "pointer",
                    color: buttonBackground,
                    height: "53px",
                    width: "146px",
                  }}
                  onClick={addNetworks}
                >
                  <Button
                    className="heading-btn"
                    style={{
                      backgroundColor: buttonBackground,
                      color: buttonTextColor,
                    }}
                  >
                    <AddIcon style={{ height: "30px", width: "30px" }} />
                  </Button>
                  {t("Add Network")}
                </div>
              </div>
              {!isNetworkDataLoading ? (
                formik.values.networks.map((network, index) => (
                  <HealthNetwork
                    key={index}
                    network={network}
                    organizationName={formik.values.organizationName}
                    allNetworks={formik.values.networks}
                    isDataPartiallyfilled={isDataPartiallyfilled}
                    setIsDataPartiallyfilled={setIsDataPartiallyfilled}
                    setIsNetworkImageUploading={setIsNetworkImageUploading}
                    index={index}
                    setNetworks={(args) =>
                      formik.setFieldValue("networks", [...args])
                    }
                  />
                ))
              ) : (
                <p>{t("Loading Health Networks")}</p>
              )}
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            backgroundColor: secondaryColor,
            color: buttonTextColor,
          }}
          onClick={resetModal}
          disabled={isLoading || isNetworkImageUploading}
          className="cancel-btn"
        >
          {t("Cancel")}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
          disabled={isLoading || isNetworkImageUploading}
          className="add-btn"
        >
          {isLoading ? "Loading ..." : action === "edit" ? "Edit" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrganizationModal.propTypes = {
  organization: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};
