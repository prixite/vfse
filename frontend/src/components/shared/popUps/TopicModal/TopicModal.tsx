import { useState } from "react";

import {
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import { categories } from "@src/helpers/utils/constants";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/TopicModal/TopicModal.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function TopicModal(props: Props) {
  const [selectedImage, setSelectedImage] = useState([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const handleTitle = (event) => {
    if (event.target.value.length) {
      setTitleError("");
    }
    setTitle(event?.target?.value);
  };

  const handleDescription = (event) => {
    if (event.target.value.length) {
      setDescriptionError("");
    }
    setDescription(event?.target?.value);
  };

  const resetModal = () => {
    props?.handleClose();
  };

  //   const handleErrors = () => {
  //     !userProfileImage.length && !selectedImage.length
  //       ? setImageError("Image is not selected")
  //       : setImageError("");
  //     !title ? setTitleError("Title is required.") : setTitleError("");
  //     !description
  //       ? setDescriptionError("Description is required.")
  //       : setDescriptionError("");
  //   };

  return (
    <Dialog className="topic-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">Create Topic</span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <>
            <div>
              <p className="info-label required">Title</p>
              <TextField
                className="full-field"
                value={title}
                type="text"
                onChange={handleTitle}
                variant="outlined"
                placeholder="Default"
              />
              <p className="errorText" style={{ marginTop: "5px" }}>
                {titleError}
              </p>
            </div>
            <div>
              <p className="info-label required">Description</p>
              <TextField
                className="full-field-desc"
                type="text"
                value={description}
                onChange={handleDescription}
                variant="outlined"
                placeholder="Default"
              />
              <p className="errorText" style={{ marginTop: "5px" }}>
                {descriptionError}
              </p>
            </div>
            <div>
              {categories?.length ? (
                <p className="topics-header">
                  <span className="info-label">Choose categories max(3)</span>
                </p>
              ) : (
                ""
              )}
              <ToggleButtonGroup
                color="primary"
                aria-label="text formatting"
                style={{ flexWrap: "wrap" }}
              >
                {categories?.length &&
                  categories?.map((item) => (
                    <ToggleButton
                      key={item}
                      value={item}
                      className="toggle-btn"
                    >
                      {item}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </div>
            <div>
              <p className="info-label required">Image (optional)</p>
              <DropzoneBox
                // imgSrc={userProfileImage}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
              />
            </div>
            <div className="notify-checkbox">
              <FormGroup>
                <FormControlLabel
                  disabled
                  control={<Checkbox />}
                  label="Notify me on follow-up replies via email"
                />
              </FormGroup>
            </div>
          </>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            backgroundColor: secondaryColor,
            color: buttonTextColor,
          }}
          onClick={resetModal}
          disabled={true}
          className="cancel-btn"
        >
          Cancel
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={resetModal}
          className="add-btn"
        >
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
