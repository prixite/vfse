/* eslint-disable react/prop-types */
import * as React from "react";

import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GridCloseIcon } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import {
  deleteImageFromS3,
  uploadImageToS3,
} from "@src/helpers/utils/imageUploadUtils";
import { updateUsernameService } from "@src/services/userService";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useUsersMePartialUpdateMutation,
} from "@src/store/reducers/generated";
import "@src/components/common/presentational/editProfilePicModal/editProfileModal.scss";

const EditProfilePicModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const { data: currentUser, refetch } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

  const [updatePicture] = useUsersMePartialUpdateMutation();

  const handleUpdate = async () => {
    await uploadImageToS3(selectedImage[0])
      .then(async (data) => {
        await updateUsernameService(
          {
            first_name: currentUser?.first_name,
            last_name: currentUser?.last_name,
            meta: {
              profile_picture: data?.location,
              title: "Profile picture",
            },
          },
          updatePicture
        )
          .then(() => {
            toast.success("Profile picture updated successfully");
            setOpen(false);
            refetch();
          })
          .catch(async () => {
            toast.error("Something went wrong");
            await deleteImageFromS3(selectedImage[0]);
          });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
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
          imgSrc={currentUser?.profile_picture}
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfilePicModal;
