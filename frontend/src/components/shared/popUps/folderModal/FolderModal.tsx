import { useState, useEffect } from "react";

import { TextField, Grid, ToggleButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { timeOut, categories } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { Category, Folder } from "@src/store/reducers/generated";
import "@src/components/shared/popUps/folderModal/folderModal.scss";

interface dataStateProps {
  action?: string;
  title?: string;
  id?: number;
  folderCategoriesID?: number[];
  categoryName?: string;
}
interface FolderModalProps {
  open: boolean;
  handleClose: () => void;
  categoryData?: Category;
  folderDataState: dataStateProps;
}

const initialState: Folder = {
  name: "",
  categories: [],
};
const constantData: LocalizationInterface = localizedData();
const validationSchema = yup.object({
  name: yup
    .string()
    .min(1)
    .max(50)
    .required(constantData.FolderModalPopUp.nameRequired),
});

const ToggleButton = styled(MuiToggleButton)(
  ({ selectedColor }: { selectedColor?: string }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedColor,
    },
  })
);

export default function FolderModal({
  open,
  handleClose,
  categoryData,
  folderDataState,
}: FolderModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const id = folderDataState.id;
  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const { data: categoriesList = [] } = api.useGetCategoriesQuery();
  const [isLoading, setIsLoading] = useState(false);

  const {
    addFolderText,
    folderNameText,
    chooseCategories,
    cancel,
    editFolderText,
  } = constantData.FolderModalPopUp;
  const { categoriesText } = constantsData.topicModal;
  const { toastData } = constantData;

  //API
  const [addNewFolder] = api.useAddFolderMutation();
  const [updateFolder] = api.useUpdateFolderMutation();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (folderDataState.action === "add") {
        handleAddFolder();
      } else {
        handleEditFolder();
      }
    },
  });
  useEffect(() => {
    if (folderDataState.action === "edit") {
      populateEditableData();
    } else {
      populateAddData();
    }
  }, [folderDataState.action, open]);

  const populateEditableData = () => {
    formik.setValues({
      name: folderDataState.title,
      categories: folderDataState.folderCategoriesID,
    });
  };
  const populateAddData = () => {
    formik.setValues({
      name: "",
      categories: [categoryData?.id],
    });
  };
  const handleAddFolder = async () => {
    setIsLoading(true);
    addNewFolder({
      folder: {
        name: formik.values.name,
        categories: [...formik.values.categories],
      },
    })
      .unwrap()
      .then(() => {
        toast.success(toastData.folderAddSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
      })
      .catch((err) => {
        toastAPIError(toastData.folderAddError, err.status, err.data);
      })
      .finally(() => {
        resetModal();
        setIsLoading(false);
      });
  };

  const handleEditFolder = () => {
    setIsLoading(true);
    updateFolder({
      id,
      folder: {
        name: formik.values.name,
        categories: formik.values.categories,
      },
    })
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
  const handleSelectedCategories = (event, newFormats) => {
    if (newFormats.length) {
      formik.setFieldValue(categoriesText, newFormats);
    }
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
          <span className="modal-header">
            {folderDataState.action === "add" ? addFolderText : editFolderText}
          </span>
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
                <div className="modal-content-header">
                  {categories?.length && (
                    <p className="topics-header">
                      <span className="info-label">{chooseCategories}(1)</span>
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
                          selectedColor={`${item?.color}`}
                        >
                          {item?.name}
                        </ToggleButton>
                      ))}
                  </ToggleButtonGroup>
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
          {folderDataState.action === "add" ? addFolderText : editFolderText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
