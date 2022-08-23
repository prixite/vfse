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
  name: yup.string().min(1).max(50).required("name is required!"),
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
        toast.success("Folder Successfully added", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .catch(() => {
        toast.error("Error occured while adding Folder", {
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
          <span className="modal-header">Add Folder</span>
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
                  <p className="info-label">Folder Name </p>
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

              <Grid item xs={6}>
                <div>
                  <p className="info-label required"> Folder Category </p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      name="role"
                      value={categoryData.id}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
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
          Cancel
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
          Add Folder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
