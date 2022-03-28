import { useState, useEffect } from "react";

import {
  TextField,
  Grid,
  FormControl,
  Select,
  InputAdornment,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Buffer } from "buffer";
import { useDropzone } from "react-dropzone";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/articleModal/articleModal.scss";
window.Buffer = window.Buffer || Buffer;

interface ArticleModalProps {
  open: boolean;
  handleClose: () => void;
}
export default function ArticleModal({ open, handleClose }: ArticleModalProps) {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [isLoading, setIsLoading] = useState(false);
  const [docLink, setDocLink] = useState("");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    onDrop: (acceptedFiles) =>
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
  });
  const resetModal = () => {
    handleClose();
  };
  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length) {
      (async () => {
        setIsLoading(true);
        await uploadImageToS3(acceptedFiles[0]).then(
          async (data: S3Interface) => {
            setDocLink(data?.location);
            setIsLoading(false);
          }
        );
      })();
    }
  }, [acceptedFiles]);

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
                    className="info-field"
                    variant="outlined"
                    name="siteName"
                    size="small"
                    placeholder="Type in  title"
                  />
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
                    name="siteAddress"
                    size="small"
                    placeholder="Type or paste text here"
                  />
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
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                    ></Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">Upload a document (optional)</p>
                  <TextField
                    inputProps={{ readOnly: true }}
                    value={docLink}
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
          type="submit"
          disabled={isLoading}
        >
          Add Documentation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
