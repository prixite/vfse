import { useState, useEffect } from "react";

import AddIcon from "@mui/icons-material/Add";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import SiteSection from "@src/components/shared/popUps/networkModal/SiteSection";
import {
  deleteImageFromS3,
  uploadImageToS3,
} from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import {
  addNewHealthNetworkService,
  updateHealthNetworkService,
} from "@src/services/organizationService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  Organization,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsSitesUpdateMutation,
} from "@src/store/reducers/api";
import { S3Interface, NetworkModalFormState } from "@src/types/interfaces";
import "@src/components/shared/popUps/networkModal/networkModal.scss";

interface Props {
  organization: Organization;
  open: boolean;
  handleClose: () => void;
  action: string;
}
const initialState: NetworkModalFormState = {
  networkName: "",
  networkLogo: "",
  sitePointer: [{ name: "", address: "" }],
};
const validationSchema = yup.object({
  networkName: yup.string().required("Name is required"),
  networkLogo: yup.string().required("Image is not selected"),
});

export default function NetworkModal(props: Props) {
  const { t } = useTranslation();
  const selectedOrganization = useSelectedOrganization();
  const { appearance } = selectedOrganization;
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [addHealthNetwork] = useOrganizationsHealthNetworksCreateMutation();
  const [updateOrganizationSites] = useOrganizationsSitesUpdateMutation();
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [isSiteDataPartiallyFilled, setIsSiteDataPartiallyFilled] =
    useState(false);
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: () => {
      if (props.action === "edit") {
        handleEditOrganization();
      } else {
        handleAddNewHealthNetwork();
      }
    },
  });
  useEffect(() => {
    if (props?.organization && props?.open) {
      const sites = props?.organization?.sites;
      formik.setValues({
        networkName: props.organization?.name,
        networkLogo: props.organization?.appearance?.logo,
        sitePointer: [...sites],
      });
    }
  }, [props?.organization, props?.open]);

  useEffect(() => {
    if (selectedImage.length) {
      formik.setFieldValue("networkLogo", selectedImage[0]);
    }
  }, [selectedImage.length]);

  const validateSiteForms = () => {
    const valid = formik.values.sitePointer?.every((site) => {
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

  const handleEditOrganization = async () => {
    setIsLoading(true);
    const { id } = props.organization;
    if (validateSiteForms()) {
      if (formik.values.networkName && selectedImage.length) {
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
                .catch(async (error) => {
                  toastAPIError(
                    "Error occurred while saving health network",
                    error?.status,
                    error.data
                  );
                  await deleteImageFromS3(data?.location);
                });
            }
          }
        );
        resetModal();
      } else if (formik.values.networkName && formik.values.networkLogo) {
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
            .catch((error) => {
              toastAPIError(
                "Error occurred while saving health network",
                error?.status,
                error.data
              );
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
    if (formik.values.networkName && selectedImage.length) {
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
                .catch(async (error) => {
                  toastAPIError(
                    "Error occurred while adding health network",
                    error?.status,
                    error.data
                  );
                  await deleteImageFromS3(data?.location);
                });
            }
          })
          .catch((err) => {
            toastAPIError("Failed to upload image", err.status, err.data);
          });
      }
    }
    setIsSiteDataPartiallyFilled(true);
    setIsLoading(false);
  };

  const getOrganizationObject = () => {
    const TempSites = formik.values.sitePointer.filter(
      (site) => site?.name && site?.address
    );
    return {
      name: formik.values.networkName,
      number_of_seats: null,
      appearance: {
        sidebar_text: appearance.sidebar_text,
        button_text: appearance.button_text,
        sidebar_color: appearance.sidebar_color,
        primary_color: appearance.primary_color,
        secondary_color: appearance?.secondary_color,
        font_one: appearance.font_one,
        font_two: appearance.font_two,
        banner: formik.values.networkLogo,
        logo: formik.values.networkLogo,
        icon: formik.values.networkLogo,
      },
      sites: TempSites,
    };
  };

  const addSite = () => {
    formik.setFieldValue("sitePointer", [
      ...formik.values.sitePointer,
      { name: "", address: "" },
    ]);
  };
  const resetModal = () => {
    formik.resetForm();
    setSelectedImage([]);
    props?.handleClose();
  };
  return (
    <Dialog className="network-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
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
            <p className="dropzone-title required">{t("Logo")}</p>
            <DropzoneBox
              setSelectedImage={setSelectedImage}
              imgSrc={formik.values.networkLogo}
              selectedImage={selectedImage}
            />
            {formik.errors.networkLogo?.length && !selectedImage.length ? (
              <p className="errorText">{formik.errors.networkLogo}</p>
            ) : (
              ""
            )}
          </div>
          <div className="network-info">
            <p className="info-label required">{t("Health Network")}</p>
            <TextField
              name="networkName"
              className="info-field"
              variant="outlined"
              value={formik.values.networkName}
              placeholder="Enter name here"
              onChange={formik.handleChange}
            />
            <p
              className="errorText"
              style={{ marginTop: "0px", marginBottom: "5px" }}
            >
              {formik.errors.networkName}
            </p>
          </div>
          {formik.values.sitePointer.map((site, index) => (
            <SiteSection
              key={index}
              index={index}
              sitee={site}
              setSites={(args) =>
                formik.setFieldValue("sitePointer", [...args])
              }
              isSiteDataPartiallyFilled={isSiteDataPartiallyFilled}
              setIsSiteDataPartiallyFilled={setIsSiteDataPartiallyFilled}
              AllSites={formik.values.sitePointer}
            />
          ))}
          <div
            className="network-info"
            style={{
              cursor: "pointer",
              color: buttonBackground,
              height: "53px",
              width: "138px",
              padding: "10px",
            }}
            onClick={addSite}
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
            {t("Add Site")}
          </div>
        </div>
      </DialogContent>
      <DialogActions
        style={{ padding: "20px 18px", justifyContent: "space-around" }}
      >
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
          {t("Cancel")}
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
          onClick={() => formik.handleSubmit()}
          disabled={isLoading}
          className="add-btn"
        >
          {props?.action === "edit" ? "Edit" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
