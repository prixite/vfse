import { useState, useEffect, useMemo } from "react";

import {
  TextField,
  Grid,
  FormControl,
  InputAdornment,
  ToggleButtonGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import { Buffer } from "buffer";
import { convertToRaw, EditorState } from "draft-js";
import draftjsToHtml from "draftjs-to-html";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import TextEditor from "@src/components/common/smart/textEditor/TextEditor";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import {
  addIdToHeadings,
  convertImages,
  toastAPIError,
} from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { useAppSelector } from "@src/store/hooks";
import { api } from "@src/store/reducers/api";
import { Document, Folder } from "@src/store/reducers/generated";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "@src/components/common/smart/textEditor/textEditor.scss";
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

const ToggleButton = styled(MuiToggleButton)(
  ({ selectedColor }: { selectedColor?: string }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white !important",
      backgroundColor: `${selectedColor} !important`,
    },
  })
);
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
  const { categoryId, folderId } = useParams<{
    categoryId: string;
    folderId: string;
  }>();
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      handleAddNewDocument();
    },
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

    const payload: Document = {
      ...formik.values,
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
      .catch((error) => {
        toastAPIError(
          "Error occured while adding Article",
          error.status,
          error.data
        );
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

  const handleOnClick = () => {
    let htmlString = draftjsToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    htmlString = addIdToHeadings(htmlString);
    htmlString = convertImages(htmlString); //calling to resolve a bug in package

    formik
      .setFieldValue("text", htmlString)
      .then(() => {
        setOnChangeValidation(true);
        formik.handleSubmit();
      })
      .catch();
  };

  useEffect(() => {
    if (categoriesList && categoriesList.length && open) {
      if (categoryId) {
        formik.setFieldValue(categories, [
          categoriesList.find(
            (category) => category?.id.toString() === categoryId
          )?.id,
        ]);
      }
    }
  }, [categoriesList, open, categoryId]);

  const finalFolders = useMemo(() => {
    let solFolders = [];
    categoriesList.forEach((category) => {
      if (formik.values.categories.includes(category?.id)) {
        category.folders.forEach((folder) => {
          if (
            formik.values.categories.every((el) =>
              folder.categories.includes(el)
            )
          ) {
            solFolders.push(folder);
          }
        });
        const uniqueArr = Array.from(new Set(solFolders.map((a) => a.id))).map(
          (id) => {
            return solFolders.find((a) => a.id === id);
          }
        );
        solFolders = uniqueArr;
      }
    });
    return solFolders;
  }, [formik.values.categories, open]);

  useEffect(() => {
    if (formik.values.categories.length && open) {
      setFolderList([...finalFolders]);
    } else {
      setFolderList([]);
    }
  }, [formik.values.categories, open]);

  useEffect(() => {
    if (open && folderId) {
      formik.setFieldValue(folder, folderId);
    }
  }, [folderId, open]);

  const handleOnChangeCategories = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number[]
  ) => {
    formik.setFieldValue(categories, newFormats);
  };

  const handleOnChangeFolders = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number[]
  ) => {
    formik.setFieldValue(folder, newFormats);
  };

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
                  <TextEditor
                    htmlText={formik.values.text}
                    editorState={editorState}
                    setEditorState={setEditorState}
                  />
                  {/* <TextField
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
                  /> */}
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.text}
                  </p>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="info-section">
                  {categories?.length && (
                    <p style={{ marginBottom: "6px" }}>
                      <span className="info-label">{categoryText}</span>
                    </p>
                  )}
                  <FormControl sx={{ minWidth: "100%" }}>
                    <ToggleButtonGroup
                      disabled={
                        isCategoriesLoading || categoryId ? true : false
                      }
                      value={formik.values.categories || ""}
                      color="primary"
                      aria-label="text formatting"
                      style={{ flexWrap: "wrap" }}
                      onChange={handleOnChangeCategories}
                    >
                      {categoriesList.length
                        ? categoriesList.map((item, index) => (
                            <ToggleButton
                              key={index}
                              value={item.id}
                              className="toggle-btn"
                              selectedColor={`${item?.color}`}
                            >
                              {item?.name}
                            </ToggleButton>
                          ))
                        : ""}
                    </ToggleButtonGroup>
                  </FormControl>
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.categories}
                  </p>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="info-section">
                  {formik.values.categories?.length ? (
                    <p style={{ marginBottom: "6px" }}>
                      <span className="info-label">{folderText}</span>
                    </p>
                  ) : (
                    ""
                  )}
                  <FormControl sx={{ minWidth: "100%" }}>
                    <ToggleButtonGroup
                      defaultValue="none"
                      disabled={isCategoriesLoading || folderId ? true : false}
                      value={formik.values.folder || ""}
                      color="primary"
                      aria-label="text formatting"
                      style={{ flexWrap: "wrap" }}
                      exclusive={true}
                      onChange={handleOnChangeFolders}
                    >
                      {folderList.map((item, index) => (
                        <ToggleButton
                          key={index}
                          value={item.id}
                          className="toggle-btn"
                          selectedColor={`#773cbd`}
                        >
                          {item?.name}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </FormControl>
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.folder}
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
          onClick={handleOnClick}
          disabled={isLoading}
        >
          {addArticleText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
