import { useEffect, useState } from "react";

import {
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
// import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { categories, timeOut } from "@src/helpers/utils/constants";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { Topic } from "@src/store/reducers/generated";
import { S3Interface } from "@src/types/interfaces";
import "@src/components/shared/popUps/topicModal/topicModal.scss";

window.Buffer = window.Buffer || Buffer;
interface Props {
  open: boolean;
  handleClose: () => void;
}
const initialState: Topic = {
  title: "",
  description: "",
  reply_email_notification: false,
};
const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const ToggleButton = styled(MuiToggleButton)(
  ({ selectedcolor }: { selectedcolor?: string }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedcolor,
    },
  })
);

export default function TopicModal({ open, handleClose }: Props) {
  const { t } = useTranslation();
  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postTopics] = api.useAddTopicMutation();
  const [selectedImage, setSelectedImage] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { data: categoriesList = [] } = api.useGetCategoriesQuery();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleTopicSubmit();
    },
  });

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const handleSelectedCategories = (event, newFormats) => {
    if (newFormats.length <= 3) {
      formik.setFieldValue("categories", newFormats);
    }
  };
  const handleImageUploadChange = () => {
    setIsImageUploading(true);
    uploadImageToS3(selectedImage[0])
      .then(async (data: S3Interface) => {
        formik.setFieldValue("image", data?.location);
      })
      .finally(() => {
        setIsImageUploading(false);
      });
  };
  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };

  const handleTopicSubmit = () => {
    setIsLoading(true);
    postTopics({
      topic: { ...formik.values },
    })
      .unwrap()
      .then(() => {
        toast.success(`${"Successfully Created"}`, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
      })
      .catch((err) => {
        toastAPIError("Error occured", err?.status, err.data);
      })
      .finally(() => {
        setIsLoading(false);
        handleClose();
      });
  };

  useEffect(() => {
    if (selectedImage && selectedImage?.length) {
      handleImageUploadChange();
    }
  }, [selectedImage]);

  return (
    <Dialog className="topic-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">{t("Create Topic")}</span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <>
            <div className="modal-content-title">
              <p className="info-label required">{t("Title")}</p>
              <TextField
                autoComplete="off"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                className="full-field"
                type="text"
                variant="outlined"
              />
              {formik.errors?.title && (
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.errors?.title}
                </p>
              )}
            </div>
            <div className="modal-content-description">
              <p className="info-label required">{t("Description")}</p>
              <TextField
                className="full-field-desc"
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                variant="outlined"
              />
              {formik.errors?.description && (
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.errors?.description}
                </p>
              )}
            </div>
            <div className="modal-content-header">
              {categories?.length && (
                <p className="topics-header">
                  <span className="info-label">
                    {t("Choose categories max")}(3)
                  </span>
                </p>
              )}
              <ToggleButtonGroup
                value={formik.values.categories}
                color="primary"
                aria-label="text formatting"
                style={{ flexWrap: "wrap" }}
                onChange={handleSelectedCategories}
              >
                {categoriesList?.length &&
                  categoriesList?.map((item, index) => (
                    <ToggleButton
                      key={index}
                      value={item.id}
                      className="toggle-btn"
                      selectedcolor={`${item?.color}`}
                    >
                      {item?.name}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </div>
            <div className="modal-content-label">
              <p className="info-label">{t("Image")} (optional)</p>
              <DropzoneBox
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                isUploading={isImageUploading}
              />
            </div>
            <div className="notify-checkbox">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.reply_email_notification}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "reply_email_notification",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={t("Notify me on follow-up replies via email")}
                />
              </FormGroup>
            </div>
          </>
        </div>
      </DialogContent>
      <DialogActions
        style={{
          padding: "20px 24px",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={{
            backgroundColor: secondaryColor,
            color: buttonTextColor,
          }}
          onClick={resetModal}
          className="cancel-btn"
        >
          {t("Cancel")}
        </Button>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
          className="add-btn"
          disabled={isLoading}
        >
          {t("Publish")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
