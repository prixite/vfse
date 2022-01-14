import { useState, useEffect } from "react";

import { Box, TextField, Select, MenuItem, FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import { Buffer } from "buffer";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  addNewOrganizationService,
  addNewHealthNetworksService,
} from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import {
  HealthNetwork as HealthNeworkArg,
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsHealthNetworksUpdateMutation,
  useOrganizationsHealthNetworksListQuery,
} from "@src/store/reducers/api";

import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";

window.Buffer = window.Buffer || Buffer;
export default function OrganizationModal({
  action,
  organization,
  open,
  handleClose,
  refetch,
}) {
  const [page, setPage] = useState("1");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationID, setOrganizationID] = useState();
  const [organizationSeats, setOrganizationSeats] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [imageError, setImageError] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addNewOrganization] = useOrganizationsCreateMutation();
  const [addNewNetworks] = useOrganizationsHealthNetworksUpdateMutation();
  const [networks, setNetworks] = useState<HealthNeworkArg[]>([
    { name: "", appearance: { logo: "" } },
  ]);
  const [sidebarColor, setSidebarColor] = useState("");
  const [sidebarTextColor, setSidebarTextColor] = useState("");
  const [ButtonTextColor, setButtonTextColor] = useState("");
  const [ButtonColor, setButtonColor] = useState("");
  const [secondColor, setSecondColor] = useState("");
  const [fontone, setFontOne] = useState("");
  const [fonttwo, setFontTwo] = useState("");
  const [isDataPartiallyfilled, setIsDataPartiallyfilled] = useState(false);
  const [isNetworkImageUploading, setIsNetworkImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: networksData,
    error,
    isLoading: isNetworkDataLoading,
  } = useOrganizationsHealthNetworksListQuery(
    {
      page: 1,
      id: organizationID,
    },
    {
      skip: !organizationID,
    }
  );

  const resetModal = () => {
    handleClose();
    setOrganizationName("");
    setOrganizationID(undefined);
    setOrganizationSeats("");
    setOrganizationError("");
    setImageError("");
    setSidebarColor("");
    setSidebarTextColor("");
    setButtonTextColor("");
    setButtonColor("");
    setOrganizationLogo("");
    setSecondColor("");
    setNetworks([{ name: "", appearance: { logo: "" } }]);
  };

  const {
    popUpNewOrganization,
    newOrganizationPageTrackerdesc1,
    newOrganizationPageTrackerdesc2,
    newOrganizationName,
    newOrganizationSeats,
    newOrganizationBtnNext,
    newOrganizationBtnSave,
    newOrganizationBtnCancel,
    newOrganizationLogo,
    newOrganizationColor1,
    newOrganizationColor2,
    newOrganizationColor3,
    newOrganizationColor4,
    newOrganizationFont1,
    newOrganizationFont2,
    newOrganizationHealthNetworks,
    newOrganizationAddNetwork,
  } = localizedData().organization.popUp;

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
    if (organization && open) {
      setOrganizationID(organization?.id);
      setOrganizationName(organization?.name);
      setSidebarColor(organization?.appearance?.sidebar_color);
      setSidebarTextColor(organization?.appearance?.sidebar_text);
      setButtonTextColor(organization?.appearance?.button_text);
      setButtonColor(organization?.appearance?.primary_color);
      setSecondColor(organization?.appearance?.secondary_color);
      setFontOne(organization?.appearance?.font_one);
      setFontTwo(organization?.appearance?.font_two);
      setOrganizationLogo(organization?.appearance?.logo);
    }
    if (!organization && open) {
      setSidebarColor(sideBarBackground);
      setSidebarTextColor(sideBarTextColor);
      setButtonTextColor(buttonTextColor);
      setButtonColor(buttonBackground);
      setSecondColor(secondaryColor);
      setFontOne(fontOne);
      setFontTwo(fontTwo);
    }
    if (open) {
      setPage("1");
    }
  }, [organization, open]);

  const handleChange = (event) => {
    setPage(event.target.value);
  };

  const handleOrganizationName = (event) => {
    if (event.target.value.length) {
      setOrganizationError("");
    }
    setOrganizationName(event.target.value);
  };

  const handleOrganizationSeats = (event) => {
    setOrganizationSeats(event.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSetNewOrganization = async () => {
    setIsLoading(true);
    if (!organizationName) {
      setOrganizationError("This value is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (organizationName && selectedImage.length) {
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
              setOrganizationID,
              refetch
            )
              .then(() => setPage("2"))
              .catch(() =>
                toast.success("Error Occured", {
                  autoClose: 1000,
                  pauseOnHover: false,
                })
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
      handleUpdateNetworks();
    }
  };
  const handleUpdateOrganization = async () => {
    setIsLoading(true);
    if (!organizationName) {
      setOrganizationError("This value is required");
    }
    if (!(selectedImage.length || organizationLogo)) {
      setImageError("Image is not selected");
    }
    if (organizationName && selectedImage.length) {
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
              updateOrganization,
              refetch
            );
          }
        }
      );
    } else if (organizationLogo && organizationName) {
      const organizationObject = getOrganizationObject();
      if (organizationObject?.appearance.banner || organizationObject) {
        await updateOrganizationService(
          organizationID,
          organizationObject,
          updateOrganization,
          refetch
        );
      }
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    const valid = networks?.every((network) => {
      if (
        (network?.name === "" && network?.appearance?.logo !== "") ||
        (network?.name !== "" && network?.appearance?.logo === "") ||
        network?.name === organizationName
      ) {
        return false;
      } else {
        return true;
      }
    });
    return valid;
  };
  const handleUpdateNetworks = async () => {
    if (validateForm()) {
      setIsLoading(true);
      const TempNetworks = networks.filter(
        (network) => network?.name && network?.appearance?.logo !== ""
      );
      if (!TempNetworks.length) {
        toast.error("Add Networks first", {
          autoClose: 2000,
          pauseOnHover: false,
        });
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
      handleUpdateNetworks();
    }
  };

  const changeSideBarColor = (color: string) => setSidebarColor(color);

  const changeButtonColor = (color: string) => setButtonColor(color);

  const changeSideBarTextColor = (color: string) => setSidebarTextColor(color);

  const changeButtonTextColor = (color: string) => setButtonTextColor(color);

  const changeSecondaryColor = (color: string) => setSecondColor(color);

  const onChangeFontOne = (event) => {
    setFontOne(event.target.value);
  };
  const onChangeFontTwo = (event) => {
    setFontTwo(event.target.value);
  };
  const addNetworks = () => {
    setNetworks([{ name: "", appearance: { logo: "" } }, ...networks]);
    setIsDataPartiallyfilled(true);
  };

  const getOrganizationObject = () => {
    return {
      name: organizationName,
      number_of_seats: organizationSeats || null,
      appearance: {
        sidebar_text: sidebarTextColor,
        button_text: ButtonTextColor,
        sidebar_color: sidebarColor,
        primary_color: ButtonColor,
        secondary_color: secondColor,
        font_one: fontone,
        font_two: fonttwo,
        banner: organizationLogo,
        logo: organizationLogo,
        icon: organizationLogo,
      },
    };
  };
  useEffect(() => {
    if (selectedImage?.length) {
      setImageError("");
    }
  }, [selectedImage]);

  useEffect(() => {
    if (!isNetworkDataLoading && !error) {
      if (networksData && networksData.length && open) {
        setNetworks([...networksData]);
      }
      if (!(networksData && networksData.length) && open) {
        setNetworks([{ name: "", appearance: { logo: "" } }]);
      }
    }
  }, [isNetworkDataLoading, networksData, error]);

  return (
    <Dialog className="organization-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {organization?.name ?? popUpNewOrganization}
          </span>
          <span className="dialog-page">
            <span className="pg-number">
              {`${newOrganizationPageTrackerdesc1} ${page} ${newOrganizationPageTrackerdesc2}`}
              <span style={{ marginLeft: "16px" }}>
                <Radio
                  checked={page === "1"}
                  onChange={handleChange}
                  value="1"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "1" }}
                  size="small"
                />
                <Radio
                  checked={page === "2"}
                  onChange={handleChange}
                  disabled={!organizationID}
                  value="2"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "2" }}
                  size="small"
                />
              </span>
            </span>
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <>
              <div>
                <p className="dropzone-title">{newOrganizationLogo}</p>
                <DropzoneBox
                  imgSrc={organizationLogo}
                  setSelectedImage={setSelectedImage}
                />
                {imageError?.length ? (
                  <p className="errorText">{imageError}</p>
                ) : (
                  ""
                )}
              </div>
              <div
                className="client-info"
                style={
                  imageError ? { marginTop: "15px" } : { marginTop: "24px" }
                }
              >
                <div className="info-section">
                  <p className="info-label">{newOrganizationName}</p>
                  <TextField
                    value={organizationName}
                    className="info-field"
                    variant="outlined"
                    placeholder="Advent Health"
                    onChange={handleOrganizationName}
                  />
                  <p className="errorText" style={{ marginTop: "15px" }}>
                    {organizationError}
                  </p>
                  <p
                    className="info-label"
                    style={
                      organizationError
                        ? { marginTop: "10px" }
                        : { marginTop: "20px" }
                    }
                  >
                    {newOrganizationSeats}
                  </p>
                  <TextField
                    error
                    value={organizationSeats}
                    className="info-field"
                    variant="outlined"
                    placeholder="6"
                    onChange={handleOrganizationSeats}
                  />
                  <div className="color-section">
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={newOrganizationColor1}
                          color={sidebarColor}
                          onChange={changeSideBarColor}
                        />
                      </div>
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={newOrganizationColor2}
                          color={ButtonColor}
                          onChange={changeButtonColor}
                        />
                      </div>
                    </div>
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={newOrganizationColor3}
                          color={sidebarTextColor}
                          onChange={changeSideBarTextColor}
                        />
                      </div>
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={newOrganizationColor4}
                          color={ButtonTextColor}
                          onChange={changeButtonTextColor}
                        />
                      </div>
                    </div>
                    <div className="color-pickers">
                      <div style={{ marginTop: "25px", marginRight: "24px" }}>
                        <ColorPicker
                          title={`Secondary Color:`}
                          color={secondColor}
                          onChange={changeSecondaryColor}
                        />
                      </div>
                    </div>
                  </div>

                  <h4 style={{ marginTop: "25px" }} className="labels">
                    {newOrganizationFont1}
                  </h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value={fontone}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={onChangeFontOne}
                        >
                          <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                          <MenuItem value={"calibri"}>Calibri</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            ProximaNova
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo" style={{ fontFamily: fontone }}>
                      AaBbCcDd
                    </span>
                  </div>
                  <h4 className="labels">{newOrganizationFont2}</h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value={fonttwo}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={onChangeFontTwo}
                        >
                          <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                          <MenuItem value={"calibri"}>Calibri</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            ProximaNova
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo" style={{ fontFamily: fonttwo }}>
                      AaBbCcDd
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="health-header">
                <span className="heading-txt">
                  {newOrganizationHealthNetworks}
                </span>
                <Button
                  className="heading-btn"
                  disabled={isNetworkImageUploading}
                  onClick={addNetworks}
                >
                  <img src={AddBtn} className="add-btn" />
                  {newOrganizationAddNetwork}
                </Button>
              </div>
              {!isNetworkDataLoading ? (
                networks.map((network, index) => (
                  <HealthNetwork
                    key={index}
                    network={network}
                    organizationName={organizationName}
                    allNetworks={networks}
                    isDataPartiallyfilled={isDataPartiallyfilled}
                    setIsDataPartiallyfilled={setIsDataPartiallyfilled}
                    setIsNetworkImageUploading={setIsNetworkImageUploading}
                    index={index}
                    setNetworks={setNetworks}
                  />
                ))
              ) : (
                <p>Loading Health Networks</p>
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
          {newOrganizationBtnCancel}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={
            action === "edit" ? editClientModalActions : addClientModalActions
          }
          disabled={isLoading || isNetworkImageUploading}
          className="add-btn"
        >
          {isLoading
            ? "Loading..."
            : action === "edit"
            ? "Edit"
            : page === "1"
            ? newOrganizationBtnNext
            : newOrganizationBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrganizationModal.propTypes = {
  organization: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};
