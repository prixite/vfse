import { useState, useEffect } from "react";

import {
  TextField,
  Grid,
  FormControl,
  Select,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { useAppSelector } from "@src/store/hooks";
import {
  Document,
  useVfseCategoriesListQuery,
  useVfseDocumentsCreateMutation,
} from "@src/store/reducers/generated";
import "@src/components/shared/popUps/articleModal/articleModal.scss";
window.Buffer = window.Buffer || Buffer;

interface ArticleModalProps {
  open: boolean;
  handleClose: () => void;
}

const initialState: Document = {
  title: "",
  text: "",
  categories: [],
};
const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  text: yup.string().required("Text is required"),
  categories: yup.array().min(1).required("Category is required"),
});

export default function ArticleModal({ open, handleClose }: ArticleModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    useVfseCategoriesListQuery();
  const [addNewDocument] = useVfseDocumentsCreateMutation();
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleAddNewDocument();
    },
  });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    onDrop: (acceptedFiles) =>
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
  });
  const handleAddNewDocument = () => {
    setIsLoading(true);
    addNewDocument({ document: { ...formik.values } })
      .unwrap()
      .then(() => {
        toast.success("Article Successfully added", {
          autoClose: 2000,
          pauseOnHover: false,
        });
        resetModal();
      })
      .catch(() => {
        toast.success("Error occured while adding Article", {
          autoClose: 2000,
          pauseOnHover: false,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };
  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      (async () => {
        setIsLoading(true);
        await uploadImageToS3(acceptedFiles[0]).then(
          async (data: S3Interface) => {
            formik.setFieldValue("document_link", data?.location);
            setIsLoading(false);
          }
        );
      })();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (categoriesList && categoriesList.length) {
      formik.setFieldValue("categories", [categoriesList[0].id]);
    }
  }, [categoriesList]);

  return (
    <Dialog className="article-modal" open={open}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">Add Article</span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <div className="article-info">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">Title</p>
                  <TextField
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="Type in  title"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.title}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">Content</p>
                  <TextField
                    className="info-field"
                    multiline
                    minRows={4}
                    variant="outlined"
                    name="text"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                    size="small"
                    placeholder="Type or paste text here"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.text}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">Category</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      defaultValue="none"
                      disabled={isCategoriesLoading}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      value={formik.values.categories[0]?.toString() || ""}
                      onChange={(e) =>
                        formik.setFieldValue("categories", [e.target.value])
                      }
                    >
                      {categoriesList.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.categories}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">Upload a document (optional)</p>
                  <TextField
                    inputProps={{ readOnly: true }}
                    value={formik.values.document_link || ""}
                    className="info-field"
                    variant="outlined"
                    size="small"
                    type="url"
                    placeholder="PDF file to be uploaded"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <div style={{ zIndex: "100" }}>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <Button className="copy-btn">upload</Button>
                            </div>
                          </div>
                        </InputAdornment>
                      ),
                    }}
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
          Add Article
        </Button>
      </DialogActions>
    </Dialog>
  );
}
