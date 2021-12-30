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
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import { updateOrganizationService } from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsPartialUpdateMutation } from "@src/store/reducers/api";

import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";

window.Buffer = window.Buffer || Buffer;
export default function OrganizationModal(props) {
  //const [addNewOrganization] = useOrganizationsCreateMutation();
  const [page, setPage] = useState("1");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSeats, setOrganizationSeats] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [imageError, setImageError] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [networks, setNetworks] = useState([1]);
  const [sidebarColor, setSidebarColor] = useState("ffff");
  const [sidebarTextColor, setSidebarTextColor] = useState("ffff");
  const [ButtonTextColor, setButtonTextColor] = useState("ffff");
  const [ButtonColor, setButtonColor] = useState("ffff");
  const [fontOne, setFontOne] = useState("");
  const [fontTwo, setFontTwo] = useState("");

  useEffect(() => {
    if (props?.organization) {
      setOrganizationName(props.organization?.name);
      setSidebarColor(props?.organization?.appearance?.sidebar_color);
      setSidebarTextColor(props?.organization?.appearance?.sidebar_text);
      setButtonTextColor(props?.organization?.appearance?.button_text);
      setButtonColor(props?.organization?.appearance?.primary_color);
      setFontOne(props?.organization?.appearance?.font_one);
      setFontTwo(props?.organization?.appearance?.font_two);
    }
  }, [props?.organization]);
  const {
    popUpNewOrganization,
    newOrganizationPageTrackerdesc1,
    newOrganizationPageTrackerdesc2,
    newOrganizationName,
    newOrganizationSeats,
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
  } = useAppSelector((state) => state.myTheme);

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
    const { id } = props.organization;
    if (!organizationName) {
      setOrganizationError("This value is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (organizationName && selectedImage.length) {
      const organizationObject = getOrganizationObject();
      uploadImageToS3(selectedImage[0]).then(async (data) => {
        organizationObject.appearance.banner = data?.location;
        organizationObject.appearance.logo = data?.location;
        organizationObject.appearance.icon = data?.location;
        if (organizationObject?.appearance.banner || organizationObject) {
          await updateOrganizationService(
            id,
            organizationObject,
            updateOrganization,
            props.refetch
          )
            .then(() => toast.success("Organization successfully Updated"))
            .catch((error) => setOrganizationError(error?.response));
        }
      });
    }
  };

  const changeSideBarColor = (color: string) => setSidebarColor(color);

  const changeButtonColor = (color: string) => setButtonColor(color);

  const changeSideBarTextColor = (color: string) => setSidebarTextColor(color);

  const changeButtonTextColor = (color: string) => setButtonTextColor(color);

  const onChangeFontOne = (event) => {
    setFontOne(event.target.value);
  };
  const onChangeFontTwo = (event) => {
    setFontTwo(event.target.value);
  };
  const addNetworks = () => {
    setNetworks([...networks, networks.length]);
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
        font_one: fontOne,
        font_two: fontTwo,
      },
    };
  };

  useEffect(() => {
    if (selectedImage?.length) {
      setImageError("");
    }
  }, [selectedImage]);

  useEffect(() => {
    setSidebarTextColor(sideBarTextColor);
    setSidebarColor(sideBarBackground);
    setButtonColor(ButtonTextColor);
    setButtonColor(buttonBackground);
  }, [sideBarTextColor, sideBarBackground, ButtonTextColor, buttonBackground]);

  return (
    <Dialog
      className="organization-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props.organization?.name ?? popUpNewOrganization}
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
                  value="2"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "2" }}
                  size="small"
                />
              </span>
            </span>
            <img
              src={CloseBtn}
              className="cross-btn"
              onClick={props.handleClose}
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <>
              <div>
                <p className="dropzone-title">{newOrganizationLogo}</p>
                <DropzoneBox setSelectedImage={setSelectedImage} />
                {imageError?.length ? (
                  <p className="errorText">{imageError}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="client-info">
                <div className="info-section">
                  <p className="info-label">{newOrganizationName}</p>
                  <TextField
                    error={organizationError?.length ? true : false}
                    value={organizationName}
                    className="info-field"
                    variant="outlined"
                    helperText={organizationError}
                    placeholder="Advent Health"
                    onChange={handleOrganizationName}
                  />
                  <p className="info-label" style={{ marginTop: "25px" }}>
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
                  </div>

                  <h4 style={{ marginTop: "25px" }} className="labels">
                    {newOrganizationFont1}
                  </h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value={fontOne}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={onChangeFontOne}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                          <MenuItem value={"calibri"}>Calibri</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            ProximaNova
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo">AaBbCcDd</span>
                  </div>
                  <h4 className="labels">{newOrganizationFont2}</h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value={fontTwo}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                          onChange={onChangeFontTwo}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"helvetica"}>Helvetica</MenuItem>
                          <MenuItem value={"calibri"}>Calibri</MenuItem>
                          <MenuItem value={"ProximaNova-Regular"}>
                            ProximaNova
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo">AaBbCcDd</span>
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
                <Button className="heading-btn" onClick={addNetworks}>
                  <img src={AddBtn} className="add-btn" />
                  {newOrganizationAddNetwork}
                </Button>
              </div>
              {networks.map((network) => (
                <HealthNetwork
                  key={network}
                  setSelectedImage={setSelectedImage}
                />
              ))}
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={props.handleClose}
          className="cancel-btn"
        >
          {newOrganizationBtnCancel}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={handleSetNewOrganization}
          className="add-btn"
        >
          {newOrganizationBtnSave}
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
};
