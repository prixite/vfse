import { useState, useEffect } from "react";

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  //addNewOrganizationService,
} from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import {
  Organization,
  //useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";

import SiteSection from "./SiteSection";

import "@src/components/shared/popUps/NetworkModal/NetworkModal.scss";

interface Props {
  organization: Organization;
  setOrganization: (arg: object) => void;
  refetch: () => void;
  open: boolean;
  handleClose: () => void;
}

export default function NetworkModal(props: Props) {
  const { currentOrganization } = useAppSelector((state) => state.organization);
  const { appearance } = currentOrganization;
  //const [addNewOrganization] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [networkName, setNetworkName] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageError, setImageError] = useState("");
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [sites, setSites] = useState([1]);
  const {
    popUpNewNetwork,
    newNetworkAddSite,
    newNetworkLogo,
    newNetworkName,
    newNetworkBtnSave,
    newNetworkBtnCancel,
  } = localizedData().modalities.popUp;

  useEffect(() => {
    if (props?.organization) {
      setNetworkName(props.organization?.name);
    } else {
      setNetworkName("");
    }
  }, [props?.organization]);

  const handleNetworkName = (event) => {
    if (event.target.value.length) {
      setNetworkError("");
    }
    setNetworkName(event.target.value);
  };

  const handleSetNewOrganization = async () => {
    const { id } = props.organization;
    if (!networkName) {
      setNetworkError("This value is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (networkName && selectedImage.length) {
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
            .then(() => {
              toast.success("Organization successfully Updated");
              props.handleClose();
            })
            .catch((error) => setNetworkError(error?.response));
        }
      });
    }
  };

  const getOrganizationObject = () => {
    return {
      name: networkName,
      number_of_seats: null,
      appearance: {
        sidebar_text: appearance.sidebar_text,
        button_text: appearance.button_text,
        sidebar_color: appearance.sidebar_color,
        primary_color: appearance.primary_color,
        font_one: appearance.font_one,
        font_two: appearance.font_two,
      },
    };
  };

  const addSite = () => {
    setSites([...sites, sites.length + 1]);
  };

  return (
    <Dialog
      className="network-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props.organization?.name ?? popUpNewNetwork}
          </span>
          <span className="dialog-page">
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
          <div>
            <p className="dropzone-title">{newNetworkLogo}</p>
            <DropzoneBox setSelectedImage={setSelectedImage} />
            {imageError?.length ? (
              <p className="errorText">{imageError}</p>
            ) : (
              ""
            )}
          </div>
          <div className="network-info">
            <p className="info-label">{newNetworkName}</p>
            <TextField
              className="info-field"
              variant="outlined"
              value={networkName}
              placeholder="Enter name here"
              onChange={handleNetworkName}
              helperText={networkError}
            />
          </div>
          {sites.map((site, index) => (
            <SiteSection key={index} siteNumber={site} />
          ))}
          <div className="network-info">
            <Button className="heading-btn" onClick={addSite}>
              <img src={AddBtn} className="add-btn" />
              {newNetworkAddSite}
            </Button>
          </div>
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
          {newNetworkBtnCancel}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={handleSetNewOrganization}
          className="add-btn"
        >
          {newNetworkBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
