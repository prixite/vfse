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
import { timeOut } from "@src/helpers/utils/constants";
import {
  deleteImageFromS3,
  uploadImageToS3,
} from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import { updateUsernameService } from "@src/services/userService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useUsersMePartialUpdateMutation,
} from "@src/store/reducers/generatedWrapper";

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
              location: currentUser?.location,
              slack_link: currentUser?.slack_link,
              calender_link: currentUser?.calender_link,
              zoom_link: currentUser?.zoom_link,
            },
          },
          updatePicture
        )
          .then(() => {
            toast.success("Profile picture updated successfully.", {
              autoClose: timeOut,
              pauseOnHover: false,
            });
            setOpen(false);
            refetch();
          })
          .catch(async (err) => {
            toastAPIError("Something went wrong.", err.status, err.data);
            await deleteImageFromS3(selectedImage[0]);
          });
      })
      .catch((err) => {
        toastAPIError("Something went wrong", err.status, err.data);
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

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
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
        <Button
          style={{
            backgroundColor: secondaryColor,
            color: buttonTextColor,
          }}
          className="cancel-btn"
          onClick={handleClose}
        >
          {"Cancel"}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={handleUpdate}
          disabled={!selectedImage[0]}
          className="add-btn"
        >
          {"Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfilePicModal;
