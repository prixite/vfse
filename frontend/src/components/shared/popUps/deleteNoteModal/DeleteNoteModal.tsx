import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTranslation } from "react-i18next";

import ModalIcon from "@src/assets/modalicon.png";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/shared/popUps/deleteNoteModal/deleteNoteModal.scss";

interface Props {
  handleNoteDelete: () => void;
  open: boolean;
  handleClose: () => void;
}

const DeleteNoteModal = ({ open, handleClose, handleNoteDelete }: Props) => {
  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ConfirmationModal">
        <DialogContent className="ConfirmationModal__Content">
          <img src={ModalIcon} style={{ marginBottom: "16px" }} />
          <DialogContentText className="DialogueMessage">
            {t("Delete this comment?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="ConfirmationModal__Actions">
          <Button
            style={{
              backgroundColor: secondaryColor,
              color: buttonTextColor,
            }}
            className="btnModal"
            onClick={handleClose}
          >
            {t("No")}
          </Button>
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            className="btnModal"
            onClick={handleNoteDelete}
          >
            {t("Yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteNoteModal;
