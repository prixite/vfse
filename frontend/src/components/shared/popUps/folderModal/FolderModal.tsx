import { useState } from "react";

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
import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { Category } from "@src/store/reducers/generated";
import "@src/components/shared/popUps/folderModal/folderModal.scss";

interface FolderModalProps {
  open: boolean;
  handleClose: () => void;
  categoryData: Category;
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

export default function FolderModal({
  open,
  handleClose,
  categoryData,
}: FolderModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addFolderText, folderNameText, folderCategoryText, cancel } =
    constantsData.folderModalPopUp;
  const { toastData } = constantsData;

  //API
  const [addNewFolder] = api.useAddFolderMutation();

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
    addNewFolder({
      folder: { name: formik.values.name, categories: [categoryData?.id] },
    })
      .unwrap()
      .then(() => {
        toast.success(toastData.folderAddSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
      })
      .catch(() => {
        toast.error(toastData.folderAddError, {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .finally(() => {
        resetModal();
        setIsLoading(false);
      });
  };

  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };

  return (
    <Dialog className="folder-modal" open={open}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">{addFolderText}</span>
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
                      value={categoryData.id}
                      className="select-cls"
                      inputProps={{ "aria-label": "Without label" }}
                      onChange={formik.handleChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      // disabled={!props?.roles?.length}
                    >
                      <MenuItem value={categoryData.id}>
                        {categoryData.name}
                      </MenuItem>
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
          {addFolderText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
