import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { localizedData } from "@src/helpers/utils/language";
import { constants } from "@src/helpers/utils/constants";
import { useAppSelector } from "@src/store/hooks";
import { useHistory } from "react-router-dom";
import "@src/components/shared/popUps/AddSiteFirstModal/AddSiteFirstModal.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddSiteFirstModal = ({
  open,
  handleClose,
}: Props) => {
  const history = useHistory();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { organizationRoute } = constants;
  const { dialogMessage, noButton, yesButton } =
    localizedData().confirmSiteDialog;

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const navigateToSite = ()=>{
    history.push(`/${organizationRoute}/${selectedOrganization?.id}/sites`);
  }
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ConfirmationModal">
        <DialogContent className="ConfirmationModal__Content">
          <DialogContentText className="DialogueMessage">
            {dialogMessage}
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
            onClick={navigateToSite}
          >
            {yesButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSiteFirstModal;
