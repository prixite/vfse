import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";

import "@src/components/shared/popUps/addSiteFirstModal/addSiteFirstModal.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddSiteFirstModal = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { organizationRoute } = constants;

  const selectedOrganization = useSelectedOrganization();
  const navigateToSite = () => {
    navigate(`/${organizationRoute}/${selectedOrganization?.id}/sites`);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} className="ConfirmationModal">
        <DialogContent className="ConfirmationModal__Content">
          <DialogContentText className="DialogueMessage">
            {t(
              "Sites do not exist for this organization, you have to create site first to create system."
            )}
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
            {t("Cancel")}
          </Button>
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            className="btnModal"
            onClick={navigateToSite}
          >
            {t("Add Site")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSiteFirstModal;
