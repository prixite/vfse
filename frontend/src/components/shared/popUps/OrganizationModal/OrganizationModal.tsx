import { useState, useEffect } from "react";
import { useAppSelector } from "@src/store/hooks";
import { Box, TextField, Select, MenuItem, FormControl } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import AddBtn from "@src/assets/svgs/add.svg";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";
import { toast } from "react-toastify";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import {
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  addNewOrganizationService,
} from "@src/services/organizationService";

export default function OrganizationModal(props) {
  const [addNewOrganization] = useOrganizationsCreateMutation();
  const [page, setPage] = useState("1");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSeats, setOrganizationSeats] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [networks, setNetworks] = useState([1]);
  const [sidebarColor, setSidebarColor] = useState("ffff");
  const [sidebarTextColor, setSidebarTextColor] = useState("ffff");
  const [ButtonTextColor, setButtonTextColor] = useState("ffff");
  const [ButtonColor, setButtonColor] = useState("ffff");
  const constantData: object = localizedData()?.organization?.popUp;
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
  } = constantData;

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
    console.log("enetered1");
    if (props?.organization?.id) {
      console.log("enetered1");
      const { id, ...organization } = props.organization;
      await updateOrganizationService(
        id,
        organization,
        updateOrganization,
        props.refetch
      );
      toast.success("Organization successfully updated");
    } else {
      if (!organizationName) {
        setOrganizationError("This value is required");
      } else {
        const organizationObject = getOrganizationObject();
        await addNewOrganizationService(
          organizationObject,
          addNewOrganization,
          props.refetch
        )
          .then(() => toast.success("Organization successfully added"))
          .catch((error) => setOrganizationError(error?.data?.name));
      }
    }
  };

  const changeSideBarColor = (color: string) => setSidebarColor(color);

  const changeButtonColor = (color: string) => setButtonColor(color);

  const changeSideBarTextColor = (color: string) => setSidebarTextColor(color);

  const changeButtonTextColor = (color: string) => setButtonTextColor(color);

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
        font_one: "ProximaNova-Regular",
        font_two: "ProximaNova-Regular",
        logo: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
        icon: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
        banner:
          "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
      },
    };
  };

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
                <DropzoneBox />
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
                          value=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Font 1</MenuItem>
                          <MenuItem value={20}>Font 2</MenuItem>
                          <MenuItem value={30}>Font 3</MenuItem>
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
                          value=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Font 1</MenuItem>
                          <MenuItem value={20}>Font 2</MenuItem>
                          <MenuItem value={30}>Font 3</MenuItem>
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
                <HealthNetwork key={network} />
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
