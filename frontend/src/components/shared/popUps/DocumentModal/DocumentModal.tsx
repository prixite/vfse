import { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, Grid, MenuItem, FormControl, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/DocumentModal/DocumentModal.scss";
import {
    useProductsModelsListQuery, useModalitiesListQuery
} from "@src/store/reducers/api";
import {useDropzone} from 'react-dropzone'
import { localizedData } from "@src/helpers/utils/language";

export default function DocumentModal({
    open, handleClose
}) {
    const [modal, setModal] = useState(null);
    const [modality, setModality] = useState(null);
    const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
        (state) => state.myTheme
    );
    const { data: productData, isFetching: fetchingProducts } = useProductsModelsListQuery();
    const { data: modalitiesList, isLoading: isModalitiesLoading } = useModalitiesListQuery();
    const {
        title,
        link,
        upload_btn,
        model,
        product_model,
        modalities,
        btnSave,
        btnCancel,
      } = localizedData().documentation.popUp;

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const dropdownStyles = {
        PaperProps: {
          style: {
            maxHeight: 300,
            width: 220,
          },
        },
    };
    const stopImmediatePropagation = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };
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

    return(
        <Dialog className="document-modal" open={open} onClose={handleClose}>
            <DialogTitle>
                <div className="title-section">
                <span className="modal-header">{title}</span>
                <span className="dialog-page">
                    <img src={CloseBtn} className="cross-btn" onClick={handleClose} />
                </span>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="modal-content">
                    <div className="info-section">
                        <p className="info-label">{link}</p>
                        <TextField
                            className="info-field"
                            variant="outlined"
                            size="small"
                            type="url"
                            placeholder="https://example.com"
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
                    </div>
                    <div className="info-section">
                        <p className="info-label">{model}</p>
                        <TextField
                            className="info-field"
                            variant="outlined"
                            size="small"
                            type="url"
                            placeholder="Model Name"
                        />
                    </div>
                    <div className="dropdown-wrapper">
                    <Grid item xs={6}>
                        <div className="info-section" style={{marginRight: "8px"}}>
                            <p className="info-label">{product_model}</p>
                            <FormControl sx={{ minWidth: "100%" }}>
                                <Select
                                    value={modal?.name}
                                    displayEmpty
                                    disabled={!productData?.length}
                                    className="info-field"
                                    inputProps={{ "aria-label": "Without label" }}
                                    style={{ height: "48px", marginRight: "15px", zIndex: "2000" }}
                                    MenuProps={dropdownStyles}
                                >
                                <MenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClickCapture={stopImmediatePropagation}
                                    style={{ background: "transparent", padding: "0" }}
                                >
                                    <TextField
                                        style={{ width: "100%", padding: "10px" }}
                                        className="search"
                                        variant="outlined"
                                        size="small"
                                        // value={query}
                                        placeholder="search"
                                        //onChange={(e) => handleSearch(e, productData)}
                                    />
                                </MenuItem>
                                {!fetchingProducts ? (
                                    productData?.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        value={item.name}
                                        onClick={() => setModal(item)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    >
                                        {item.name}
                                    </MenuItem>
                                    ))
                                ) : (
                                    ""
                                )}
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="info-section" style={{marginLeft: "8px"}}>
                            <p className="info-label">{modalities}</p>
                            <FormControl sx={{ minWidth: "100%" }}>
                                <Select
                                    value={modality?.name}
                                    displayEmpty
                                    disabled={!modalitiesList?.length}
                                    className="info-field"
                                    inputProps={{ "aria-label": "Without label" }}
                                    style={{ height: "48px", marginRight: "15px", zIndex: "2000" }}
                                    MenuProps={dropdownStyles}
                                >
                                <MenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClickCapture={stopImmediatePropagation}
                                    style={{ background: "transparent", padding: "0" }}
                                >
                                    <TextField
                                        style={{ width: "100%", padding: "10px" }}
                                        className="search"
                                        variant="outlined"
                                        size="small"
                                        // value={query}
                                        placeholder="search"
                                        //onChange={(e) => handleSearch(e, modalitiesList)}
                                    />
                                </MenuItem>
                                {!isModalitiesLoading ? (
                                    modalitiesList?.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        value={item.name}
                                        onClick={() => setModality(item)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    >
                                        {item.name}
                                    </MenuItem>
                                    ))
                                ) : (
                                    ""
                                )}
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
                style={{
                    backgroundColor: secondaryColor,
                    color: buttonTextColor,
                }}
                onClick={handleClose}
                >
                    {btnCancel}
                </Button>
                <Button
                className="add-btn"
                style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                        
                }}
                >
                    {btnSave}
                </Button>
            </DialogActions>
        </Dialog>
    )
}