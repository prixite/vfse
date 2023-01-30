import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";

import "@src/components/shared/popUps/addSiteFirstModal/addSiteFirstModal.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddSiteFirstModal = ({ open, handleClose }: Props) => {
  const navigate = useNavigate();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme,
  );
  const { organizationRoute } = constants;
  const { dialogMessage, noButton, yesButton } =
    localizedData().confirmSiteDialog;

  const selectedOrganization = useSelectedOrganization();
  const navigateToSite = () => {
    navigate(`/${organizationRoute}/${selectedOrganization?.id}/sites`);
  };
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
