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
import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/productModal/productModal.scss";
import { api } from "@src/store/reducers/api";

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
  manufacturer: number;
  modality: number;
  setProductValue: (arg0: string) => void;
}

const initialState = {
  name: "",
  model: "",
};

const validationSchema = yup.object({
  name: yup.string().min(1).max(20).required("Product Name is required!"),
  model: yup.string().min(1).max(20).required("Product Model is required!"),
});

export default function ProductModal({
  open,
  handleClose,
  setProductValue,
  modality,
  manufacturer,
}: ProductModalProps) {
  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [isLoading, setIsLoading] = useState(false);
  const [onChangeValidation, setOnChangeValidation] = useState(false);
  //API
  const [addNewProduct] = api.useProductsCreateMutation();
  const [addNewProductModal] = api.useProductsModelsCreateMutation();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleCategorySubmit();
    },
  });

  const handleCategorySubmit = async () => {
    setIsLoading(true);
    try {
      setProductValue(null);
      const product = await addNewProduct({
        productCreate: { manufacturer, name: formik.values.name },
      }).unwrap();
      await addNewProductModal({
        productModelCreate: {
          model: formik.values.model,
          product: product.id,
          modality,
          documentation: { url: "http://example.com" },
        },
      }).unwrap();
      toast.success("Product Successfully added.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    } catch (error) {
      toastAPIError("Something went wrong", error.status, error.data);
    } finally {
      setProductValue(modality.toString());
      resetModal();
      setIsLoading(false);
      handleClose();
    }
  };

  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };

  return (
    <Dialog className="product-modal" open={open}>
      <DialogTitle>
        <div id="title-cross" className="title-section">
          <span className="modal-header">{t("Add product")}</span>
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
                  <p className="info-label required">{t("Product Name")}</p>
                  <TextField
                    autoComplete="off"
                    name="name"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Product name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.name}
                  </p>
                  <p className="info-label required">Product Model</p>
                  <TextField
                    autoComplete="off"
                    name="model"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Product Model"
                    value={formik.values.model}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.model}
                  </p>
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
          disabled={isLoading}
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
        >
          {t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
