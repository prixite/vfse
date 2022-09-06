import { useState } from "react";

import { TextField, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { timeOut } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import {
  Category,
  // useVfseCategoriesListQuery, /* Api */
} from "@src/store/reducers/generated";
import "@src/components/shared/popUps/categoryModal/categoryModal.scss";

interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
}

const initialState: Category = {
  name: "",
};

const { nameRequired, title, addBtn, cancelBtn, subHeading } =
  localizedData().ManufacturerModal;

const validationSchema = yup.object({
  name: yup.string().min(1).max(20).required(nameRequired),
});

export default function AddManufacturerModal({
  open,
  handleClose,
}: CategoryModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //API
  const [addNewManufacturer] = api.useManufacturersCreateMutation();

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
    addNewManufacturer({ manufacturer: { ...formik.values } })
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
          err.originalStatus
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

  return (
    <Dialog className="category-modal" open={open}>
      <DialogTitle>
        <div id="title-cross" className="title-section">
          <span className="modal-header">{title}</span>
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
                  <p className="info-label required">{subHeading}</p>
                  <TextField
                    autoComplete="off"
                    name="name"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Manufacturer name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.name}
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
          {cancelBtn}
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
          {addBtn}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
