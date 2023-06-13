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
import { api } from "@src/store/reducers/api";
import "@src/components/shared/popUps/categoryModal/categoryModal.scss";

interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
  modality: number;
  setModalityValue: (arg0: string) => void;
}

const initialState = {
  manufacturerName: "",
  productName: "",
  model: "",
};

const validationSchema = yup.object({
  manufacturerName: yup.string().min(1).max(20).required("Name is required!"),
  productName: yup.string().min(1).max(20).required("Name is required!"),
  model: yup.string().min(1).max(20).required("Name is required!"),
});

export default function AddManufacturerModal({
  open,
  handleClose,
  modality,
  setModalityValue,
}: CategoryModalProps) {
  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //API
  const [addNewManufacturer] = api.useManufacturersCreateMutation();
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
      setModalityValue(null);
      const manufacturer = await addNewManufacturer({
        manufacturer: { name: formik.values.manufacturerName },
      }).unwrap();
      const product = await addNewProduct({
        productCreate: {
          manufacturer: manufacturer.id,
          name: formik.values.productName,
        },
      }).unwrap();
      await addNewProductModal({
        productModelCreate: {
          model: formik.values.model,
          product: product.id,
          modality,
          documentation: { url: "http://example.com" },
        },
      }).unwrap();
      toast.success("Manufacturer Successfully added.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    } catch (error) {
      toastAPIError("Something went wrong", error.status, error.data);
    } finally {
      setModalityValue(modality.toString());
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
    <Dialog className="category-modal" open={open}>
      <DialogTitle>
        <div id="title-cross" className="title-section">
          <span className="modal-header">{t("Add Manufacturer")}</span>
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
                  <p className="info-label required">
                    {t("Manufacturer Name")}
                  </p>
                  <TextField
                    autoComplete="off"
                    name="manufacturerName"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Manufacturer name"
                    value={formik.values.manufacturerName}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.manufacturerName}
                  </p>
                  <p className="info-label required">Product Name</p>
                  <TextField
                    autoComplete="off"
                    name="productName"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Product name"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.productName}
                  </p>
                  <p className="info-label required">Product Model Name</p>
                  <TextField
                    autoComplete="off"
                    name="model"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Product Model name"
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
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
          disabled={isLoading}
        >
          {t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
