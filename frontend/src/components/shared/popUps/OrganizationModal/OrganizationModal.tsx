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

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import { HealthNetwork as HealthNeworkArg } from "@src/store/reducers/api";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import { updateOrganizationService , addNewOrganizationService, addNewHealthNetworksService } from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsCreateMutation, useOrganizationsPartialUpdateMutation , useOrganizationsHealthNetworksUpdateMutation,useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";
import { toast } from "react-toastify";

window.Buffer = window.Buffer || Buffer;
export default function OrganizationModal(props) {
  //const [addNewOrganization] = useOrganizationsCreateMutation();
  const [page, setPage] = useState("1");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationID , setOrganizationID] = useState();
  const [organizationSeats, setOrganizationSeats] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [imageError, setImageError] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [organizationLogo,setOrganizationLogo] = useState("");
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addNewOrganization] = useOrganizationsCreateMutation();
  const [addNewNetworks] = useOrganizationsHealthNetworksUpdateMutation();
  const [networks, setNetworks] = useState<HealthNeworkArg[]>([{name : "" , appearance : {logo : ""}}]);
//  console.log(networks,"All networks Object");
  const [sidebarColor, setSidebarColor] = useState("");
  const [sidebarTextColor, setSidebarTextColor] = useState("");
  const [ButtonTextColor, setButtonTextColor] = useState("");
  const [ButtonColor, setButtonColor] = useState("");
  const [fontone, setFontOne] = useState("");
  const [fonttwo, setFontTwo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: networksData,
    error,
    isLoading : isNetworkDataLoading
  } =useOrganizationsHealthNetworksListQuery({
    page: 1,
    id: organizationID,
  });



  const resetModal = () => {
    props?.handleClose();
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
    setNetworks([{name : "" , appearance : {logo : ""}}]);
  }

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
    fontOne,
    fontTwo
  } = useAppSelector((state) => state.myTheme);
  

  useEffect(() => {
    if (props?.organization && props?.open) {
      setOrganizationID(props?.organization?.id);
      setOrganizationName(props.organization?.name);
      setSidebarColor(props?.organization?.appearance?.sidebar_color);
      setSidebarTextColor(props?.organization?.appearance?.sidebar_text);
      setButtonTextColor(props?.organization?.appearance?.button_text);
      setButtonColor(props?.organization?.appearance?.primary_color);
      setFontOne(props?.organization?.appearance?.font_one);
      setFontTwo(props?.organization?.appearance?.font_two);
      setOrganizationLogo(props?.organization?.appearance?.logo);
    }
    if(!props?.organization && props?.open) {
      setSidebarColor(sideBarBackground);
      setSidebarTextColor(sideBarTextColor);
      setButtonTextColor(buttonTextColor);
      setButtonColor(buttonTextColor);
      setFontOne(fontOne);
      setFontTwo(fontTwo);
    }
  }, [props?.organization , props?.open]);
   

  const handleChange = (event) => {
    if(organizationID) {
    setPage(event.target.value);
    }
    else {
      toast.success("Create Organization First" , {
        autoClose :1000,
        pauseOnHover: false
      })
    }
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
    if (!(selectedImage.length)) {
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
              props.refetch
            ).then(()=>setPage("2"))
            .catch(()=>console.log("Error case"));
          }
        }
      );
    }
    setIsLoading(false);
  }

  const addClientModalActions  = () => {
    if(page === "1") {
      handleSetNewOrganization();
    }
    else if (page === "2") {
      handleUpdateNetworks();
    }
  }
  const handleUpdateOrganization = async () => {
    setIsLoading(true);
    if (!organizationName) {
      setOrganizationError("This value is required");
    }
    if (!selectedImage.length || organizationLogo) {
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
              props.refetch
            );
          }
        }
      );
    }
    else if (organizationLogo && organizationName) {
      const organizationObject = getOrganizationObject();
      if (organizationObject?.appearance.banner || organizationObject) {
        await updateOrganizationService(
          organizationID,
          organizationObject,
          updateOrganization,
          props.refetch
        );
      }
    }
    setIsLoading(false);
  };
  const handleUpdateNetworks = async () => {
    setIsLoading(true);
    const TempNetworks = networks.filter((network)=>network?.name && network?.appearance?.logo !=="");
    if(!TempNetworks.length) {
      toast.success("Add Networks first");
    }
    else {
       await addNewHealthNetworksService(organizationID , addNewNetworks,TempNetworks);
    }

    setIsLoading(false);
    resetModal();
  }

  const editClientModalActions = () => {
    if(page === "1") {
      handleUpdateOrganization();
    }
    else if (page === "2") {
      handleUpdateNetworks();
    }
  }

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
    setNetworks([...networks , {name : "" , appearance : {logo : ""}}]);
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

  useEffect (()=> {
    if(!isNetworkDataLoading && !error) {
      if( networksData && networksData.length && props?.open){
    setNetworks([...networksData]);
      }
      if(!(networksData && networksData.length) && props?.open) {
        setNetworks([{name : "" , appearance : {logo : ""}}]);
      }
  }
  else if(!isNetworkDataLoading && error) {
    setNetworks([{name : "" , appearance : {logo : ""}}]);
  }
  
  },[isNetworkDataLoading, networksData,error])



  return (
    <Dialog
      className="organization-modal"
      open={props.open}
      onClose={resetModal}
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
              onClick={resetModal}
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
                <DropzoneBox imgSrc={organizationLogo} setSelectedImage={setSelectedImage} />
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
                          value={fontone}
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
                          value={fonttwo}
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
              { !isNetworkDataLoading ? networks.map((network , index) => (
                <HealthNetwork
                  key={index}
                  network = {network}
                  allNetworks = {networks}
                  index = {index}
                  setNetworks = {setNetworks}
                />
              ))
              :
              <p>Loading Health Networks</p>
            }
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
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
          onClick={resetModal}
          disabled={isLoading}
          className="cancel-btn"
        >
          {newOrganizationBtnCancel}
        </Button>
        <Button
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
          onClick={props?.action === "edit" ? editClientModalActions :  addClientModalActions}
          disabled={isLoading}
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
