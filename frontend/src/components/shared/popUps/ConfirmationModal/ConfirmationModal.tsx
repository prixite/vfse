import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/shared/popUps/ConfirmationModal/ConfirmationModal.scss";
import ModalIcon from "@src/assets/modalicon.png";

const ConfirmationModal = ({
  open,
  handleClose,
  handleDeleteOrganization,
  name,
}) => {
  const constantData: any = localizedData()?.organization.deleteDialog;
  const { dialogMessage, noButton, yesButton } = constantData;
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ConfirmationModal">
        <DialogContent className="ConfirmationModal__Content">
          <img src={ModalIcon} style={{ marginBottom: "16px" }} />
          <DialogContentText className="DialogueMessage">
            {dialogMessage}
          </DialogContentText>
          <DialogContentText className="ClientName">{name}</DialogContentText>
        </DialogContent>
        <DialogActions className="ConfirmationModal__Actions">
          <Button className="btnModal" onClick={handleClose}>
            {noButton}
          </Button>
          <Button className="btnModal" onClick={handleDeleteOrganization}>
            {yesButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
