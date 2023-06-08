import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

import AddBtn from "@src/assets/svgs/add.svg";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import HealthNetwork from "@src/components/common/presentational/healthNetwork/HealthNetwork";
import "@src/components/shared/popUps/organizationModal/organizationModal.scss";
import { useAppSelector } from "@src/store/hooks";
import { Organization } from "@src/store/reducers/api";

interface Props {
  open: boolean;
  organization: Organization;
  handleClose: () => void;
}

export default function NewHealthNetwotkModal(props: Props) {
  const { t } = useTranslation();
  const [networks, setNetworks] = useState([1]);
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

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
        <div className="title-section title-cross">
          <span className="modal-header">
            {props.organization?.name ?? " New Health Network"}
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
              <span className="heading-txt">{t("Health networks")}</span>
              <Button className="heading-btn" onClick={addNetworks}>
                <img src={AddBtn} className="add-btn" />
                {t("Add Network")}
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
            backgroundColor: secondaryColor,
            color: buttonTextColor,
          }}
          onClick={props.handleClose}
          className="cancel-btn"
        >
          {t("Cancel")}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={props.handleClose}
          className="add-btn"
        >
          {t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
