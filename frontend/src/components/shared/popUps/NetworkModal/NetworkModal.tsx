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
import SiteSection from "@src/components/shared/popUps/NetworkModal/SiteSection";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  addNewHealthNetworkService,
  updateHealthNetworkService,
  //addNewOrganizationService,
} from "@src/services/organizationService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  Organization,
  //useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsSitesUpdateMutation,
  Site,
} from "@src/store/reducers/api";

import "@src/components/shared/popUps/NetworkModal/NetworkModal.scss";

interface Props {
  organization: Organization;
  open: boolean;
  handleClose: () => void;
  action: string;
}

export default function NetworkModal(props: Props) {
  const selectedOrganization = useSelectedOrganization();
  const { appearance } = selectedOrganization;
  //const [addNewOrganization] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addHealthNetwork] = useOrganizationsHealthNetworksCreateMutation();
  const [updateOrganizationSites] = useOrganizationsSitesUpdateMutation();
  const [networkName, setNetworkName] = useState("");
  const [networkLogo, setNetworkLogo] = useState("");
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
  const [isSiteDataPartiallyFilled, setIsSiteDataPartiallyFilled] =
    useState(false);
  const {
    newNetworkAddSite,
    newNetworkLogo,
    newNetworkName,
    newNetworkBtnSave,
    newNetworkBtnCancel,
  } = localizedData().modalities.popUp;

  useEffect(() => {
    if (props?.organization && props?.open) {
      setNetworkName(props.organization?.name);
      setNetworkLogo(props?.organization?.appearance?.logo);
      const sites = props?.organization?.sites;
      setSitePointer([...sites]);
    } else {
      setNetworkName("");
      setNetworkLogo("");
    }
  }, [props?.organization, props?.open]);

  useEffect(() => {
    if (selectedImage.length || networkLogo) {
      setImageError("");
    }
  }, [selectedImage.length, networkLogo]);

  const handleNetworkName = (event) => {
    if (event.target.value.length) {
      setNetworkError("");
    }
    setNetworkName(event.target.value);
  };

  const validateSiteForms = () => {
    const valid = sitePointer?.every((site) => {
      if (
        (site?.name === "" && site?.address !== "") ||
        (site?.name !== "" && site?.address === "")
      ) {
        return false;
      } else {
        return true;
      }
    });
    return valid;
  };

  const handleSetNewOrganization = async () => {
    setIsLoading(true);
    const { id } = props.organization;
    if (!networkName) {
      setNetworkError("Name is required");
    }
    if (!(selectedImage.length || networkLogo)) {
      setImageError("Image is not selected");
    }
    if (validateSiteForms()) {
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
                organizationObject?.sites
              )
                .then(() => {
                  resetModal();
                })
                .catch(() => {
                  toast.error("HealthNetwork Update Failed", {
                    autoClose: 1000,
                    pauseOnHover: false,
                  });
                });
            }
          }
        );
        resetModal();
      } else if (networkName && networkLogo) {
        const organizationObject = getOrganizationObject();
        if (organizationObject?.appearance.banner || organizationObject) {
          await updateHealthNetworkService(
            id,
            organizationObject,
            updateOrganization,
            updateOrganizationSites,
            organizationObject?.sites
          )
            .then(() => {
              resetModal();
            })
            .catch(() => {
              toast.error("HealthNetwork Update Failed", {
                autoClose: 1000,
                pauseOnHover: false,
              });
            });
        }
      }
    }
    setIsSiteDataPartiallyFilled(true);
    setIsLoading(false);
  };

  const handleAddNewHealthNetwork = async () => {
    setIsLoading(true);
    const { id } = selectedOrganization;
    if (!networkName) {
      setNetworkError("Name is required");
    }
    if (!selectedImage.length) {
      setImageError("Image is not selected");
    }
    if (networkName && selectedImage.length) {
      if (validateSiteForms()) {
        const organizationObject = getOrganizationObject();
        await uploadImageToS3(selectedImage[0])
          .then(async (data: S3Interface) => {
            organizationObject.appearance.banner = data?.location;
            organizationObject.appearance.logo = data?.location;
            organizationObject.appearance.icon = data?.location;
            if (organizationObject?.appearance.banner || organizationObject) {
              await addNewHealthNetworkService(
                id,
                organizationObject,
                addHealthNetwork,
                updateOrganizationSites,
                organizationObject?.sites
              )
                .then(() => {
                  resetModal();
                })
                .catch(() => {
                  toast.error("HealthNetwork Add Failed", {
                    autoClose: 1000,
                    pauseOnHover: false,
                  });
                });
            }
          })
          .catch(() =>
            toast.error("Failed to upload Image", {
              autoClose: 1000,
              pauseOnHover: false,
            })
          );
      }
    }
    setIsSiteDataPartiallyFilled(true);
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
        secondary_color: appearance?.secondary_color,
        font_one: appearance.font_one,
        font_two: appearance.font_two,
        banner: networkLogo,
        logo: networkLogo,
        icon: networkLogo,
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
    setNetworkLogo("");
    setNetworkName("");
    setImageError("");
    setNetworkError("");
    setSelectedImage([]);
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
            <p className="dropzone-title required">{newNetworkLogo}</p>
            <DropzoneBox
              setSelectedImage={setSelectedImage}
              imgSrc={networkLogo}
              selectedImage={selectedImage}
            />
            {imageError?.length ? (
              <p className="errorText">{imageError}</p>
            ) : (
              ""
            )}
          </div>
          <div className="network-info">
            <p className="info-label required">{newNetworkName}</p>
            <TextField
              className="info-field"
              variant="outlined"
              value={networkName}
              placeholder="Enter name here"
              onChange={handleNetworkName}
            />
            <p
              className="errorText"
              style={{ marginTop: "0px", marginBottom: "5px" }}
            >
              {networkError}
            </p>
          </div>
          {sitePointer.map((site, index) => (
            <SiteSection
              key={index}
              index={index}
              sitee={site}
              setSites={setSitePointer}
              isSiteDataPartiallyFilled={isSiteDataPartiallyFilled}
              setIsSiteDataPartiallyFilled={setIsSiteDataPartiallyFilled}
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
          {props?.action === "edit" ? "Edit" : newNetworkBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
