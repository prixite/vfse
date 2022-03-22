import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import ModalIcon from "@src/assets/modalicon.png";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";

import "@src/components/shared/popUps/deleteNoteModal/deleteNoteModal.scss";

interface Props {
  handleNoteDelete: () => void;
  open: boolean;
  handleClose: () => void;
}

const DeleteNoteModal = ({ open, handleClose, handleNoteDelete }: Props) => {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { noButton, yesButton } = localizedData().organization.deleteDialog;
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ConfirmationModal">
        <DialogContent className="ConfirmationModal__Content">
          <img src={ModalIcon} style={{ marginBottom: "16px" }} />
          <DialogContentText className="DialogueMessage">
            Delete this comment?
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
            {noButton}
          </Button>
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            className="btnModal"
            onClick={handleNoteDelete}
          >
            {yesButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteNoteModal;
