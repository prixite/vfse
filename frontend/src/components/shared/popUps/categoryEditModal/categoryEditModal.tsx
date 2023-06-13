/* eslint react/prop-types: 0 */
import { useState, useEffect } from "react";

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
import {
  Category,
  useVfseCategoriesPartialUpdateMutation,
  useVfseCategoriesReadQuery,
} from "@src/store/reducers/generated";
import "@src/components/shared/popUps/categoryEditModal/categoryEditModal.scss";

const validationSchema = yup.object({
  name: yup.string().min(1).max(20).required("Name is required!"),
  color: yup.string().min(1).max(10).required("Color is required!"),
});

export default function CategoryEditModal({ open, handleClose, id }) {
  const { t } = useTranslation();
  const { data: category } = useVfseCategoriesReadQuery({ id });
  const [editCategory] = useVfseCategoriesPartialUpdateMutation();

  const initialState: Category = {
    name: "",
    color: "#FFFF",
  };

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //API
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleCategoryEdit();
    },
  });

  useEffect(() => {
    formik.setFieldValue("name", category?.name);
    formik.setFieldValue("color", category?.color);
  }, [category]);

  const handleCategoryEdit = () => {
    setIsLoading(true);
    editCategory({ id, category: { ...formik.values } })
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        setIsLoading(false);
        resetModal();
      })
      .catch((err) => {
        setIsLoading(false);
        toastAPIError(
          "Error occured while updating category",
          err.status,
          err.data
        );
      });
  };

  const resetModal = () => {
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
          <span className="modal-header">{"Edit Category"}</span>
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
                    placeholder="Type in Color"
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
          {"Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
