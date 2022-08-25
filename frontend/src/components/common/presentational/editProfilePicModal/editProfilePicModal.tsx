import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import "@src/components/common/presentational/editProfilePicModal/editProfileModal.scss";

const EditProfilePicModal = ({ open, setOpen, me }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [selectedImage, setSelectedImage] = React.useState([]);

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <GridCloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} className="profile-pic-modal">
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {"Edit your profile picture"}
      </BootstrapDialogTitle>
      <DialogContent>
        <DropzoneBox
          imgSrc={me?.profile_picture}
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfilePicModal;
