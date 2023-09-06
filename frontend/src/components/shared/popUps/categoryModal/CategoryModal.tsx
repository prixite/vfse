import { useState } from "react";

import { TextField, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import ColorPicker from "@src/components/common/presentational/colorPicker/ColorPicker";
import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
// import {
//   Category,
//   // useVfseCategoriesListQuery, /* Api */
// } from "@src/store/reducers/generated";
import { Category } from "@src/store/reducers/generatedWrapper";

import "@src/components/shared/popUps/categoryModal/categoryModal.scss";

interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
}

const initialState: Category = {
  name: "",
  color: "#28D4AB",
};

const validationSchema = yup.object({
  name: yup.string().min(1).max(20).required("Name is required!"),
  color: yup.string().min(1).max(10).required("Color is required!"),
});

export default function CategoryModal({
  open,
  handleClose,
}: CategoryModalProps) {
  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //API
  const [addNewCategory] = api.useAddCategoryMutation();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleCategorySubmit();
    },
  });

  const handleCategorySubmit = () => {
    setIsLoading(true);
    addNewCategory({ category: { ...formik.values } })
      .unwrap()
      .then(() => {
        toast.success("Category Successfully added.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        resetModal();
      })
      .catch((err) => {
        toastAPIError(
          "Error occured while adding Category",
          err.status,
          err.data
        );
      })
      .finally(() => {
        resetModal();
        setIsLoading(false);
        handleClose();
      });
  };

  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };

  const changeColor = (color: string) => {
    formik.setFieldValue("color", color);
  };

  return (
    <Dialog className="category-modal" open={open}>
      <DialogTitle>
        <div id="title-cross" className="title-section">
          <span className="modal-header">{t("Add Category")}</span>
          <span className="dialog-page">
            <img
              alt=""
              src={CloseBtn}
              className="cross-btn"
              onClick={resetModal}
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <div className="article-info">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label required">{t("Name")}</p>
                  <TextField
                    autoComplete="off"
                    name="name"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.name}
                  </p>
                </div>
              </Grid>

              <Grid item xs={6}>
                <div className="info-section">
                  <ColorPicker
                    title={"Color"}
                    color={formik.values.color}
                    onChange={changeColor}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          className="cancel-btn"
          style={{ backgroundColor: secondaryColor, color: buttonTextColor }}
          onClick={resetModal}
        >
          {t("Cancel")}
        </Button>
        <Button
          className="add-btn"
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
          disabled={isLoading}
        >
          {t("Add Category")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
