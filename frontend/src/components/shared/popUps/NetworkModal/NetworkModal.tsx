import { useState } from "react";
import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import AddBtn from "@src/assets/svgs/add.svg";
import "@src/components/shared/popUps/NetworkModal/NetworkModal.scss";
import { toast } from "react-toastify";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import SiteSection from "./SiteSection";
import {
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  addNewOrganizationService,
} from "@src/services/organizationService";

export default function NetworkModal(props) {
  const [addNewOrganization, { isLoading }] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [sites, setSites] = useState([1]);
  const constantData: object = localizedData()?.modalities?.popUp;
  const {
    popUpNewNetwork,
    newNetworkAddSite,
    newNetworkLogo,
    newNetworkName,
    newNetworkBtnSave,
    newNetworkBtnCancel,
  } = constantData;

  const handleSetNewOrganization = async () => {
    if (props.organization.id) {
      const { id, ...organization } = props.organization;
      await updateOrganizationService(
        id,
        organization,
        updateOrganization,
        props.refetch
      );
      toast.success("Network successfully updated");
    } else {
      await addNewOrganizationService(
        props.organization,
        addNewOrganization,
        props.refetch
      );
      toast.success("Network successfully added");
    }
    props.handleClose();
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
            <DropzoneBox />
          </div>
          <div className="network-info">
            <p className="info-label">{newNetworkName}</p>
            <TextField
              className="info-field"
              variant="outlined"
              placeholder="Enter name here"
            />
          </div>
          {sites.map((site) => (
            <SiteSection siteNumber={site} />
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
        <Button onClick={props.handleClose} className="cancel-btn">
          {newNetworkBtnCancel}
        </Button>
        <Button onClick={handleSetNewOrganization} className="add-btn">
          {newNetworkBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
