import { useState, useEffect } from "react";

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  addNewHealthNetworkService,
  updateHealthNetworkService,
  //addNewOrganizationService,
} from "@src/services/organizationService";
import { useAppSelector } from "@src/store/hooks";
import {
  Organization,
  //useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsSitesUpdateMutation,
  Site,
} from "@src/store/reducers/api";

import SiteSection from "./SiteSection";
import "@src/components/shared/popUps/NetworkModal/NetworkModal.scss";

interface Props {
  organization: Organization;
  refetch: () => void;
  open: boolean;
  handleClose: () => void;
  action: string;
}

export default function NetworkModal(props: Props) {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { appearance } = selectedOrganization;
  //const [addNewOrganization] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addHealthNetwork] = useOrganizationsHealthNetworksCreateMutation();
  const [updateOrganizationSites] = useOrganizationsSitesUpdateMutation();
  const [networkName, setNetworkName] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [sitePointer, setSitePointer] = useState<Site[]>([
    { name: "", address: "" },
  ]);
  const {
    newNetworkAddSite,
    newNetworkLogo,
    newNetworkName,
    newNetworkBtnSave,
    newNetworkBtnCancel,
  } = localizedData().modalities.popUp;

  useEffect(() => {
    if (props?.organization) {
      setNetworkName(props.organization?.name);
      const sites = props?.organization?.sites;
      setSitePointer([...sites]);
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
    setIsLoading(true);
    const { id } = props.organization;
    if (!networkName) {
      setNetworkError("This value is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (networkName && selectedImage.length) {
      const organizationObject = getOrganizationObject();
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          organizationObject.appearance.banner = data?.location;
          organizationObject.appearance.logo = data?.location;
          organizationObject.appearance.icon = data?.location;
          if (organizationObject?.appearance.banner || organizationObject) {
            await updateHealthNetworkService(
              id,
              organizationObject,
              updateOrganization,
              updateOrganizationSites,
              organizationObject?.sites,
              props.refetch
            );
          }
        }
      );
      resetModal();
    }
    setIsLoading(false);
  };
  const handleAddNewHealthNetwork = async () => {
    setIsLoading(true);
    const { id } = selectedOrganization;
    if (!networkName) {
      setNetworkError("This value is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (networkName && selectedImage.length) {
      const organizationObject = getOrganizationObject();
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          organizationObject.appearance.banner = data?.location;
          organizationObject.appearance.logo = data?.location;
          organizationObject.appearance.icon = data?.location;
          if (organizationObject?.appearance.banner || organizationObject) {
            await addNewHealthNetworkService(
              id,
              organizationObject,
              addHealthNetwork,
              updateOrganizationSites,
              organizationObject?.sites,
              props.refetch
            );
          }
        }
      );
      resetModal();
    }
    setIsLoading(false);
  };

  const getOrganizationObject = () => {
    const TempSites = sitePointer.filter((site) => site?.name && site?.address);
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
        banner: "",
        logo: "",
        icon: "",
      },
      sites: TempSites,
    };
  };

  const addSite = () => {
    //  setSites((prevState)=>[...prevState,site]);
    setSitePointer([...sitePointer, { name: "", address: "" }]);
  };
  const resetModal = () => {
    setSitePointer([{ name: "", address: "" }]);
    setNetworkName("");
    setNetworkError("");
    props?.handleClose();
  };
  return (
    <Dialog className="network-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props?.action === "edit"
              ? `Edit ${props?.organization?.name} Network`
              : "Add Network"}
          </span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
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
          {sitePointer.map((site, index) => (
            <SiteSection
              key={index}
              index={index}
              sitee={site}
              setSites={setSitePointer}
              AllSites={sitePointer}
            />
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
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: secondaryColor,
                  color: buttonTextColor,
                }
          }
          onClick={resetModal}
          disabled={isLoading}
          className="cancel-btn"
        >
          {newNetworkBtnCancel}
        </Button>
        <Button
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }
          }
          onClick={
            props.action === "edit"
              ? handleSetNewOrganization
              : handleAddNewHealthNetwork
          }
          disabled={isLoading}
          className="add-btn"
        >
          {newNetworkBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
