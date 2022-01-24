import { useEffect, useState } from "react";

import { TextField, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { localizedData } from "@src/helpers/utils/language";
import {
  addNewSiteService,
  updateSitesService,
} from "@src/services/sitesService";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/SiteModal/SiteModal.scss";
import {
  useOrganizationsSitesCreateMutation,
  useOrganizationsSitesUpdateMutation,
} from "@src/store/reducers/api";

interface siteProps {
  open: boolean;
  handleClose: () => void;
  siteId?: number;
  name?: string;
  address?: string;
  selectionID: string;
  sites?: any; // eslint-disable-line
  refetch: () => void;
  action: string;
}

export default function SiteModal(props: siteProps) {
  const [siteName, setSiteName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [addNewSite] = useOrganizationsSitesCreateMutation();
  const [updateSite] = useOrganizationsSitesUpdateMutation();

  const { fieldName, fieldAddress, btnAdd, btnEdit, btnCancel } =
    localizedData().siteModal;

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  useEffect(() => {
    if (props?.name && props?.address) {
      setSiteName(props?.name);
      setSiteAddress(props?.address);
    }
  }, [props?.open]);

  const handleSiteName = (event) => {
    if (event.target.value.length) {
      setSiteName("");
    }
    setSiteName(event.target.value);
  };

  const handleSiteAddress = (event) => {
    if (event.target.value.length) {
      setSiteAddress("");
    }
    setSiteAddress(event.target.value);
  };

  const handleAddSite = async () => {
    setIsLoading(true);
    !siteName ? setNameError("Name is required.") : setNameError("");
    !siteAddress
      ? setAddressError("Address is required.")
      : setAddressError("");
    if (siteName && siteAddress) {
      const siteObject = getSiteObject();
      await addNewSiteService(
        props?.selectionID,
        siteObject,
        addNewSite,
        props.refetch
      );
      setTimeout(() => {
        resetModal();
      }, 1000);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const handleEditSite = async () => {
    setIsLoading(true);
    !siteName ? setNameError("Name is required.") : setNameError("");
    !siteAddress
      ? setAddressError("Address is required.")
      : setAddressError("");
    if (siteName && siteAddress && props?.sites) {
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
        props?.refetch,
        "edit"
      );
      setTimeout(() => {
        resetModal();
      }, 1000);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const getSiteObject = () => {
    return {
      id: props?.siteId,
      name: siteName,
      address: siteAddress,
    };
  };

  const resetModal = () => {
    if (props?.action == "add") {
      setSiteName("");
      setNameError("");
      setSiteAddress("");
      setAddressError("");
    } else if (props?.action == "edit") {
      if (props?.name && props?.address) {
        setSiteName(props?.name);
        setSiteAddress(props?.address);
        setNameError("");
        setAddressError("");
      }
    }
    props?.handleClose();
  };

  return (
    <Dialog className="site-modal" open={props?.open}>
      <DialogTitle>
        <div className="title-section">
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
                  <p className="info-label">{fieldName}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    value={siteName}
                    onChange={handleSiteName}
                    size="small"
                    placeholder="Site name"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {nameError}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{fieldAddress}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    value={siteAddress}
                    onChange={handleSiteAddress}
                    size="small"
                    placeholder="Site address"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {addressError}
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </DialogContent>
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
          {btnCancel}
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
          onClick={props.action === "add" ? handleAddSite : handleEditSite}
        >
          {props?.action == "add" ? btnAdd : btnEdit}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
