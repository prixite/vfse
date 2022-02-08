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
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  addProductModelService,
  updateProductModelService,
} from "@src/services/DocumentationService";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/DocumentModal/DocumentModal.scss";
import {
  useProductsListQuery,
  useModalitiesListQuery,
  useProductsModelsCreateMutation,
  ProductModel,
  useProductsModelsPartialUpdateMutation,
} from "@src/store/reducers/api";

interface Props {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  selectedDocId?: number;
  selectedDoc?: ProductModel;
  action: string;
}

export default function DocumentModal({
  open,
  handleClose,
  refetch,
  selectedDocId,
  selectedDoc,
  action,
}: Props) {
  const [docLink, setDocLink] = useState(null);
  const [modelName, setModelName] = useState("");
  const [modal, setModal] = useState(null);
  const [modality, setModality] = useState(null);
  const [docLinkError, setDocLinkError] = useState("");
  const [modelNameError, setModelNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addProductModel] = useProductsModelsCreateMutation();
  const [updateProductModel] = useProductsModelsPartialUpdateMutation();

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { data: productData, isLoading: isProductsModelsLoading } =
    useProductsListQuery({});
  const { data: modalitiesList, isLoading: isModalitiesLoading } =
    useModalitiesListQuery();
  const {
    title,
    editTitle,
    link,
    upload_btn,
    model,
    product_model,
    modalities,
    btnSave,
    btnEdit,
    btnCancel,
  } = localizedData().documentation.popUp;

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

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      (async () => {
        setIsLoading(true);
        await uploadImageToS3(acceptedFiles[0]).then(
          async (data: S3Interface) => {
            setDocLink(data?.location);
            setIsLoading(false);
            setDocLinkError("");
          }
        );
      })();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (productData?.length) {
      setModal(productData[0]);
    }
  }, [productData]);

  useEffect(() => {
    if (modalitiesList?.length) {
      setModality(modalitiesList[0]);
    }
  }, [modalitiesList]);

  useEffect(() => {
    if (selectedDoc && action === "edit") {
      populateEditableData();
    }
  }, [selectedDoc, action]);

  const handleModelName = (e) => {
    if (e.target.value.length) {
      setModelNameError("");
    }
    setModelName(e.target.value);
  };

  const handleErrors = () => {
    !docLink?.length
      ? setDocLinkError("Document is not uploaded")
      : setDocLinkError("");
    !modelName
      ? setModelNameError("Model Name is required.")
      : setModelNameError("");
  };

  const verifyErrors = () => {
    if (docLink?.length && modelName && modal && modality) {
      return true;
    }
    return false;
  };

  const handleAddDocument = async () => {
    setIsLoading(true);
    handleErrors();
    if (verifyErrors()) {
      const newProductModel = getNewProductModel();
      if (newProductModel.documentation.url || newProductModel) {
        await addProductModelService(newProductModel, addProductModel, refetch)
          .then(() => {
            setTimeout(() => {
              resetModal();
              setIsLoading(false);
            }, 500);
          })
          .catch(() => {
            toast.error(
              "Model with given name already exists for selected product",
              {
                autoClose: 2000,
                pauseOnHover: false,
              }
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
    handleErrors();
    if (verifyErrors()) {
      const newProductModel = getNewProductModel();
      if (newProductModel.documentation.url || newProductModel) {
        await updateProductModelService(
          selectedDocId,
          newProductModel,
          updateProductModel,
          refetch
        )
          .then(() => {
            setTimeout(() => {
              resetModal();
              setIsLoading(false);
            }, 500);
          })
          .catch(() => {
            toast.error(
              "Model with given name already exists for selected product",
              {
                autoClose: 2000,
                pauseOnHover: false,
              }
            );
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }
  };

  const populateEditableData = () => {
    setDocLink(selectedDoc.documentation);
    setModelName(selectedDoc.model);
    const product = productData?.find(
      (prod) => prod?.name === selectedDoc.name
    );
    setModal(product);
    const modalityValue = modalitiesList?.find(
      (item) => item.name === selectedDoc?.modality
    );
    setModality(modalityValue);
  };

  const getNewProductModel = () => {
    const Documentation = {
      url: docLink,
    };
    return {
      model: modelName,
      documentation: Documentation,
      modality: modality?.id,
      product: modal?.id,
    };
  };

  const resetModal = () => {
    setDocLink(null);
    setModelName("");
    setModal(productData[0]);
    setModality(modalitiesList[0]);
    setDocLinkError("");
    setModelNameError("");
    handleClose();
  };

  return (
    <Dialog className="document-modal" open={open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {action === "add" ? title : editTitle}
          </span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <div className="info-section">
            <p className="info-label">{link}</p>
            <TextField
              inputProps={{ readOnly: true }}
              value={docLink ? docLink : ""}
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
                        <Button className="copy-btn">{upload_btn}</Button>
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
            />
            {docLinkError ? <p className="errorText">{docLinkError}</p> : ""}
          </div>
          <div className="info-section">
            <p className="info-label">{model}</p>
            <TextField
              value={modelName}
              className="info-field"
              variant="outlined"
              size="small"
              type="url"
              placeholder="Model Name"
              onChange={handleModelName}
            />
            {modelNameError ? (
              <p className="errorText">{modelNameError}</p>
            ) : (
              ""
            )}
          </div>
          <div className="dropdown-wrapper">
            <Grid item xs={6}>
              <div className="info-section" style={{ marginRight: "8px" }}>
                <p className="info-label">{product_model}</p>
                {!isProductsModelsLoading && (
                  <Autocomplete
                    id="country-select-demo"
                    sx={{ width: "100%" }}
                    style={{ height: "48px" }}
                    value={modal}
                    onChange={(e, item) => setModal(item)} // eslint-disable-line
                    options={productData ? productData : []}
                    autoHighlight
                    getOptionLabel={(option) => option?.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="info-section" style={{ marginLeft: "8px" }}>
                <p className="info-label">{modalities}</p>
                <FormControl sx={{ minWidth: "100%" }}>
                  <Select
                    value={modality?.name}
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
                  >
                    {!isModalitiesLoading
                      ? modalitiesList?.map((item, index) => (
                          <MenuItem
                            key={index}
                            value={item.name}
                            onClick={() => setModality(item)}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            {item.name}
                          </MenuItem>
                        ))
                      : ""}
                  </Select>
                </FormControl>
              </div>
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
          {btnCancel}
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
          onClick={action === "add" ? handleAddDocument : handleEditDocument}
        >
          {action === "add" ? btnSave : btnEdit}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
