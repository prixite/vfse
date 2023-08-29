import { useEffect, useState } from "react";

import { TextField, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
// import { SiteModalFormState } from "@src/components/shared/popUps/systemModalInterfaces/interfaces";
import { returnSearchedOject, toastAPIError } from "@src/helpers/utils/utils";
import {
  addNewSiteService,
  updateSitesService,
} from "@src/services/sitesService";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  useOrganizationsSitesCreateMutation,
  useOrganizationsSitesUpdateMutation,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import { SiteModalFormState } from "@src/types/interfaces";

import "@src/components/shared/popUps/siteModal/siteModal.scss";

interface siteProps {
  open: boolean;
  handleClose: () => void;
  siteId?: number;
  name?: string;
  address?: string;
  selectionID: string;
  sites?: any; // eslint-disable-line
  action: string;
}

const initialState: SiteModalFormState = {
  siteName: "",
  siteAddress: "",
};
const validationSchema = yup.object({
  siteName: yup.string().required("Name is required"),
  siteAddress: yup.string().required("Address is required"),
});
export default function SiteModal(props: siteProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [reset, setReset] = useState(true);
  const [addNewSite] = useOrganizationsSitesCreateMutation();
  const [updateSite] = useOrganizationsSitesUpdateMutation();
  const dispatch = useAppDispatch();

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { data: organizationList, isFetching: isOrgListFetching } =
    useOrganizationsListQuery({
      page: 1,
    });
  const selectedOrganization = useSelectedOrganization();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: () => {
      if (props?.action === "add") {
        handleAddSite();
      } else {
        handleEditSite();
      }
    },
  });

  useEffect(() => {
    if (props?.name && props?.address) {
      formik.setValues({
        siteName: props?.name,
        siteAddress: props?.address,
      });
    }
  }, [props?.open]);

  const handleAddSite = () => {
    setIsLoading(true);
    setReset(true);
    const siteObject = getSiteObject();
    addNewSiteService(props?.selectionID, siteObject, addNewSite)
      .then(() => {
        resetModal();
        setReset(false);
      })
      .catch((error) => {
        toastAPIError(
          "Error occured while saving site",
          error.status,
          error.data
        );
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isOrgListFetching && !reset) {
      const data = returnSearchedOject(
        organizationList,
        selectedOrganization?.id
      );
      if (data?.length) {
        dispatch(
          setSelectedOrganization({
            selectedOrganization: data[0],
          })
        );
      }
      resetModal();
      setIsLoading(false);
      setReset(true);
    }
  }, [isOrgListFetching]);

  const handleEditSite = async () => {
    setIsLoading(true);
    if (props?.sites) {
      const siteObject = getSiteObject();
      let siteIndex = -1;
      props?.sites.forEach((site, index) => {
        if (site?.id == props?.siteId) {
          siteIndex = index;
        }
      });
      // eslint-disable-next-line
      const updatedSites = [...props?.sites];
      if (siteIndex !== -1) {
        updatedSites[siteIndex] = siteObject;
      }
      await updateSitesService(
        props?.selectionID,
        updatedSites,
        updateSite,
        "edit"
      )
        .then(() => {
          setTimeout(() => {
            resetModal();
            setReset(false);
            setIsLoading(false);
          }, 500);
        })
        .catch((err) => {
          toastAPIError(
            "Site with this name already exists.",
            err.status,
            err.data
          );
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };

  const getSiteObject = () => {
    return {
      id: props?.siteId,
      name: formik.values.siteName,
      address: formik.values.siteAddress,
    };
  };

  const resetModal = () => {
    props?.handleClose();
    formik.resetForm();
  };

  return (
    <Dialog className="site-modal" open={props?.open}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {props?.action == "add" ? "Add Site" : "Edit Site"}
          </span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <div className="client-info">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{t("Name")}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    name="siteName"
                    value={formik.values.siteName}
                    onChange={formik.handleChange}
                    size="small"
                    placeholder="Site name"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.siteName}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{t("Address")}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    name="siteAddress"
                    value={formik.values.siteAddress}
                    onChange={formik.handleChange}
                    size="small"
                    placeholder="Site address"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.siteAddress}
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <DialogActions>
          <Button
            className="cancel-btn"
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
          >
            {t("Cancel")}
          </Button>
          <Button
            className="add-btn"
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
            disabled={isLoading}
            type="submit"
          >
            {props?.action == "add" ? "Add" : "Edit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
