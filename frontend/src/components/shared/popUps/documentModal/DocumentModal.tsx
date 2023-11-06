import { useState, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import {
  addProductModelService,
  updateProductModelService,
} from "@src/services/documentationService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import "@src/components/shared/popUps/documentModal/documentModal.scss";
import {
  useProductsListQuery,
  useOrganizationsModalitiesListQuery,
  useProductsModelsCreateMutation,
  ProductModelDetail,
  useProductsModelsPartialUpdateMutation,
} from "@src/store/reducers/api";
import {
  DocumentationModalFormState,
  S3Interface,
} from "@src/types/interfaces";

interface Props {
  open: boolean;
  handleClose: () => void;
  selectedDocId?: number;
  selectedDoc?: ProductModelDetail;
  action: string;
}
const initialState: DocumentationModalFormState = {
  docLink: "",
  modelName: "",
  modal: "",
  modality: "",
};
const validationSchema = yup.object({
  docLink: yup.string().required("Document is not uploaded"),
  modelName: yup.string().required("Model Name is required"),
  modal: yup.object().required("Product Name is required"),
  modality: yup.object().required("Modality is required"),
});

export default function DocumentModal({
  open,
  handleClose,
  selectedDocId,
  selectedDoc,
  action,
}: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [addProductModel] = useProductsModelsCreateMutation();
  const [updateProductModel] = useProductsModelsPartialUpdateMutation();
  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { data: productData, isLoading: isProductsModelsLoading } =
    useProductsListQuery({});

  const selectedOrganization = useSelectedOrganization();

  const { data: modalitiesList } = useOrganizationsModalitiesListQuery(
    { id: selectedOrganization.id.toString() },
    { skip: !selectedOrganization }
  );

  const dropdownStyles = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 220,
      },
    },
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    onDrop: (acceptedFiles) =>
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
  });
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (action === "add") {
        handleAddDocument();
      } else {
        handleEditDocument();
      }
    },
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      (async () => {
        setIsLoading(true);
        await uploadImageToS3(acceptedFiles[0]).then(
          async (data: S3Interface) => {
            formik.setFieldValue("docLink", data?.location);
            setIsLoading(false);
          }
        );
      })();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (productData?.length) {
      formik.setFieldValue("modal", productData[0]);
    }
  }, [productData]);

  useEffect(() => {
    if (modalitiesList?.length) {
      formik.setFieldValue("modality", modalitiesList[0]);
    }
  }, [modalitiesList]);

  useEffect(() => {
    if (selectedDoc && action === "edit") {
      populateEditableData();
    }
  }, [selectedDoc, action]);

  const verifyErrors = () => {
    if (
      formik.values.docLink?.length &&
      formik.values.modelName &&
      formik.values.modal &&
      formik.values.modality
    ) {
      return true;
    }
    return false;
  };

  const handleAddDocument = async () => {
    setIsLoading(true);
    if (verifyErrors()) {
      const newProductModel = getNewProductModel();
      if (newProductModel.documentation.url || newProductModel) {
        await addProductModelService(newProductModel, addProductModel)
          .then(() => {
            setTimeout(() => {
              resetModal();
              setIsLoading(false);
            }, 500);
          })
          .catch((err) => {
            toastAPIError(
              "Model with given name already exists for selected product",
              err.status,
              err.data
            );
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleEditDocument = async () => {
    setIsLoading(true);
    if (verifyErrors()) {
      const newProductModel = getNewProductModel();
      if (newProductModel.documentation.url || newProductModel) {
        await updateProductModelService(
          selectedDocId,
          newProductModel,
          updateProductModel
        )
          .then(() => {
            setTimeout(() => {
              resetModal();
              setIsLoading(false);
            }, 500);
          })
          .catch((err) => {
            toastAPIError(
              "Model with given name already exists for selected product",
              err.status,
              err.data
            );
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }
  };

  const populateEditableData = () => {
    const product = productData?.find(
      (prod) => prod?.name === selectedDoc.name
    );
    const modalityValue = modalitiesList?.find(
      (item) => item.name === selectedDoc?.modality
    );
    formik.setValues({
      docLink: selectedDoc.documentation,
      modelName: selectedDoc.model,
      modal: product,
      modality: modalityValue,
    });
  };

  const getNewProductModel = () => {
    const Documentation = {
      url: formik.values.docLink,
    };
    return {
      model: formik.values.modelName,
      documentation: Documentation,
      modality: formik.values.modality?.id,
      product: formik.values.modal?.id,
    };
  };

  const resetModal = () => {
    formik.resetForm();
    setOnChangeValidation(false);
    handleClose();
  };

  return (
    <Dialog className="document-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {action === "add" ? "Add Documentation" : "Edit Documentation"}
          </span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <div className="info-section">
            <p className="info-label required">{t("Documentation Link")}</p>
            <TextField
              autoComplete="off"
              inputProps={{ readOnly: true }}
              value={formik.values.docLink ? formik.values.docLink : ""}
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
                        <Button className="copy-btn">{t("Upload")}</Button>
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
            />
            <p className="errorText">{formik.errors.docLink}</p>
          </div>
          <div className="info-section">
            <p className="info-label required">{t("Model")}</p>
            <TextField
              autoComplete="off"
              name="modelName"
              value={formik.values.modelName}
              className="info-field"
              variant="outlined"
              size="small"
              type="url"
              placeholder="Model Name"
              onChange={formik.handleChange}
            />
            <p className="errorText">{formik.errors.modelName}</p>
          </div>
          <div className="dropdown-wrapper">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <div className="info-section">
                  <p className="info-label required">{t("Product")}</p>
                  {!isProductsModelsLoading && (
                    <Autocomplete
                      id="modal"
                      sx={{ width: "100%" }}
                      style={{ height: "48px" }}
                      value={formik.values.modal}
                      onChange={(e, item) =>
                        formik.setFieldValue("modal", item)
                      } // eslint-disable-line
                      options={productData ? productData : []}
                      autoHighlight
                      getOptionLabel={(option) => option?.name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  )}
                  <p className="errorText">{formik.errors.modal}</p>
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                sx={{ marginLeft: "auto" }}
              >
                <div className="info-section">
                  <p className="info-label required">{t("Modalities")}</p>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <Select
                      name="modality"
                      value={formik.values.modality}
                      displayEmpty
                      disabled={!modalitiesList?.length}
                      className="info-field"
                      inputProps={{ "aria-label": "Without label" }}
                      style={{
                        height: "48px",
                        marginRight: "15px",
                        zIndex: "2000",
                      }}
                      MenuProps={dropdownStyles}
                      onChange={formik.handleChange}
                    >
                      {modalitiesList?.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <p className="errorText">{formik.errors.modality}</p>
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
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: secondaryColor,
                  color: buttonTextColor,
                }
          }
          onClick={resetModal}
          disabled={isLoading}
        >
          {t("Cancel")}
        </Button>
        <Button
          className="add-btn"
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }
          }
          disabled={isLoading}
          onClick={() => {
            setOnChangeValidation(true);
            formik.handleSubmit();
          }}
        >
          {action === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
