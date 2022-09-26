import { useState, useEffect } from "react";

import { TextField, Grid, MenuItem, FormControl, Select } from "@mui/material";
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
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import "@src/components/shared/popUps/editFolderModal/editFolderModal.scss";

interface EditFolderModalProps {
  open: boolean;
  handleClose: () => void;
  title;
  categoryName;
  categoryID;
  id;
}

const initialState = {
  name: "",
};

const validationSchema = yup.object({
  name: yup
    .string()
    .min(1)
    .max(50)
    .required(constantsData.folderModalPopUp.nameRequired),
});

export default function EditFolderModal({
  open,
  handleClose,
  title,
  categoryName,
  categoryID,
  id,
}: EditFolderModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { editFolderText, folderNameText, folderCategoryText, cancel } =
    constantsData.folderModalPopUp;
  const { toastData } = constantsData;

  //API
  const [updateFolder] = api.useUpdateFolderMutation();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleFolderSubmit();
    },
  });

  const handleFolderSubmit = () => {
    setIsLoading(true);
    updateFolder({
      id,
      folder: { name: formik.values.name, categories: [categoryID] },
    })
      .unwrap()
      .then(() => {
        toast.success(toastData.folderUpdateSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
      })
      .catch((err) => {
        toastAPIError(toastData.folderUpdateError, err.status, err.data);
      })
      .finally(() => {
        resetModal();
        setIsLoading(false);
      });
  };
  useEffect(() => {
    populateEditableData();
  }, []);
  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };
  const populateEditableData = () => {
    formik.setValues({
      ...formik.values,
      name: title,
    });
  };
  return (
    <Dialog className="edit-folder-modal" open={open}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">{editFolderText}</span>
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
                  <p className="info-label">{folderNameText} </p>
                  <TextField
                    name="name"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Type in Folder"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.name}
                  </p>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="category-selector">
                  <p className="info-label"> {folderCategoryText} </p>
                  <FormControl>
                    <Select
                      name="role"
                      value={categoryName}
                      className="select-cls"
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={formik.handleChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                    >
                      <MenuItem value={categoryName}>{categoryName}</MenuItem>
                    </Select>
                  </FormControl>
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
          {cancel}
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
          {editFolderText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
