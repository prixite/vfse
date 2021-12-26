import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";

export default function NewHealthNetwotkModal(props) {
  const [networks, setNetworks] = useState([1]);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const constantData: object = localizedData()?.organization;
  const {
    newOrganizationBtnSave,
    newOrganizationBtnCancel,
    newOrganizationHealthNetworks,
    newOrganizationAddNetwork,
  } = constantData?.popUp;

  const addNetworks = () => {
    setNetworks([...networks, networks.length]);
  };

  return (
    <Dialog
      className="organization-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props?.organization?.name ?? constantData?.newHealthNetwork}
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
            {networks.map((network, index) => (
              <HealthNetwork key={index} />
            ))}
          </>
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
          onClick={props.handleClose}
          className="add-btn"
        >
          {newOrganizationBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
