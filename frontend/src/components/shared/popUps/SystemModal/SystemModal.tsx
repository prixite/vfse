import { useState } from "react";

import { TextField, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/SystemModal/SystemModal.scss";

interface systemProps {
  open: boolean;
  handleClose: () => void;
}

export default function SystemModal(props: systemProps) {
  const [selectedImage, setSelectedImage] = useState([]); // eslint-disable-line
  // const [newFields, setNewFields] = useState([1]);

  const {
    fieldName,
    fieldSite,
    fieldModal,
    fieldVersion,
    fieldIp,
    fieldAsset,
    fieldLocalAE,
    fieldRisName,
    fieldRisIp,
    fieldRisTitle,
    fieldRisPort,
    fieldRisAE,
    fieldDicomName,
    fieldDicomIp,
    fieldDicomTitle,
    fieldDicomPort,
    fieldDicomAE,
    fieldMRIname,
    fieldMRIHelium,
    fieldMRIMagnet,
    btnAdd,
    btnCancel,
  } = localizedData().systemModal;

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  // const handleAdd = () => {
  //   const listLength = newFields.length;
  //   setNewFields([...newFields, listLength + 1]);
  // };

  return (
    <Dialog
      className="system-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">{"Add System"}</span>
          <span className="dialog-page">
            <img
              src={CloseBtn}
              className="cross-btn"
              onClick={props.handleClose}
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {/* <DropzoneBox setSelectedImage={setSelectedImage} /> */}
          <div className="client-info">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldName}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldSite}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    type="number"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldModal}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    type="number"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldVersion}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldAsset}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldIp}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldLocalAE}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                  />
                </div>
              </Grid>
            </Grid>
            <div className="checkbox-container">
              <div className="checkBox">
                <Checkbox />
                <span className="text">vFSE[VNC OR OTHER]</span>
              </div>
              <div className="checkBox">
                <Checkbox />
                <span className="text">SSH [or terminal]</span>
              </div>
              <div className="checkBox">
                <Checkbox />
                <span className="text">Service web browser</span>
              </div>
              <div className="checkBox">
                <Checkbox />
                <span className="text">Virtual media control</span>
              </div>
            </div>
            <div className="box-heading">
              <p className="heading">{fieldRisName}</p>
              <div className="box">
                <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisIp}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisTitle}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisPort}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      placeholder=""
                      size="small"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisAE}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="box-heading">
                <p className="heading">{fieldDicomName}</p>
                <div className="box">
                  <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomIp}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomTitle}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomPort}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        placeholder=""
                        size="small"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomAE}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className="box-heading">
                <p className="heading">{fieldMRIname}</p>
                <div className="box">
                  <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldMRIHelium}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldMRIMagnet}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
              {/* <div className="add-container" onClick={handleAdd}>
                <div className="add-btn">
                  <img src={AddIcon} />
                </div>
                <span className="text">{headdingAddInfo}</span>
              </div> */}
              {/* {newFields.map((newFields) => (
                <div
                  className="info-section"
                  key={newFields}
                  style={{ width: "356px", marginTop: "22px" }}
                >
                  <p className="info-label">Name this field</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    type="number"
                    size="small"
                    placeholder=""
                  />
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className="cancel-btn"
          style={{ backgroundColor: secondaryColor, color: buttonTextColor }}
        >
          {btnCancel}
        </Button>
        <Button
          className="add-btn"
          style={{ backgroundColor: buttonBackground, color: buttonTextColor }}
        >
          {btnAdd}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
