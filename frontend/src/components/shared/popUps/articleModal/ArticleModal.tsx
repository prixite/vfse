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
import { useParams } from "react-router";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { Document, Folder } from "@src/store/reducers/generated";
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
  title: yup.string().required(constantsData.articleModal.titleRequired),
  text: yup.string().required(constantsData.articleModal.textRequired),
  categories: yup
    .array()
    .min(1)
    .required(constantsData.articleModal.categoryRequired),
});

export default function ArticleModal({ open, handleClose }: ArticleModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [onChangeValidation, setOnChangeValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    pdf,
    document_link,
    categories,
    folder,
    addArticleText,
    titleText,
    contentText,
    categoryText,
    folderText,
    uploadDocumentText,
    uploadText,
    cancelText,
  } = constantsData.articleModal;
  const { toastData } = constantsData;
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [addNewDocument] = api.useAddArticleMutation();
  const { categoryId, folderId } =
    useParams<{ categoryId: string; folderId: string }>();
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleAddNewDocument();
    },
  });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: pdf,
    onDrop: (acceptedFiles) =>
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
  });
  const handleAddNewDocument = () => {
    setIsLoading(true);
    const convertTextToHtml = `
    <h2 style="margin-bottom: 20px"><br>    <span style="font-size: 24px; color:#773cbd">${formik.values.title}</span><br></h2>
    <p> <span style=font-size: 18px> ${formik.values.text} </span></p>
    `;
    const payload: Document = {
      ...formik.values,
      text: convertTextToHtml,
    };
    addNewDocument({ document: { ...payload } })
      .unwrap()
      .then(() => {
        toast.success(toastData.articleAddSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        resetModal();
      })
      .catch(() => {
        toast.success(toastData.articleAddError, {
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
            formik.setFieldValue(document_link, data?.location);
            setIsLoading(false);
          }
        );
      })();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (categoriesList && categoriesList.length && open) {
      if (categoryId) {
        formik.setFieldValue(categories, [
          categoriesList.find(
            (category) => category?.id.toString() === categoryId
          )?.id,
        ]);
      } else {
        formik.setFieldValue(categories, [categoriesList[0].id]);
      }
    }
  }, [categoriesList, open, categoryId]);
  useEffect(() => {
    if (formik.values.categories.length && open) {
      // formik.setFieldValue("folder" , undefined);
      setFolderList([]);
      categoriesList.forEach((category) => {
        if (category?.id === formik.values.categories[0]) {
          setFolderList([...category.folders]);
        }
      });
    }
  }, [formik.values.categories, open]);

  useEffect(() => {
    if (open && folderId) {
      formik.setFieldValue(folder, folderId);
    }
  }, [folderId, open]);
  return (
    <Dialog className="article-modal" open={open}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">{addArticleText}</span>
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
                  <p className="info-label required">{titleText}</p>
                  <TextField
                    autoComplete="off"
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
                  <p className="info-label required">{contentText}</p>
                  <TextField
                    autoComplete="off"
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
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{categoryText}</p>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <Select
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      disabled={
                        isCategoriesLoading || categoryId ? true : false
                      }
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      value={formik.values.categories[0]?.toString() || ""}
                      onChange={(e) =>
                        formik.setFieldValue(categories, [e.target.value])
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
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{folderText}</p>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <Select
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      defaultValue="none"
                      disabled={isCategoriesLoading || folderId ? true : false}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      value={formik.values.folder?.toString() || ""}
                      onChange={(e) =>
                        formik.setFieldValue(folder, e.target.value)
                      }
                    >
                      {folderList.map((item, index) => (
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
                  <p className="info-label">{uploadDocumentText} (optional)</p>
                  <TextField
                    autoComplete="off"
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
                              <Button className="copy-btn">{uploadText}</Button>
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
          {cancelText}
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
          {addArticleText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
