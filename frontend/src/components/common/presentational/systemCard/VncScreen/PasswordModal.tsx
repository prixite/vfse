import { useState } from "react";

import { Dialog, Button, TextField, Grid } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import { System } from "@src/store/reducers/generated";

import VncScreenDialog from "./VncScreenDialog";
import "@src/components/common/presentational/systemCard/VncScreen/PasswordModal.scss";

interface PasswordDialogProps {
  openModal: boolean;
  handleModalClose: () => void;
  handleModalOpen: () => void;
  system: System;
  organizationId: number;
}
interface VncPassword {
  passwordConfirmation: string;
}

const initialState: VncPassword = {
  passwordConfirmation: "",
};
const validationSchema = yup.object({
  passwordConfirmation: yup.string().required("Password is required"),
});

const PasswordDialog = ({
  openModal,
  handleModalClose,
  handleModalOpen,
  system,
  organizationId,
}: PasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: () => {
      setPassword(formik.values.passwordConfirmation);
    },
  });

  return (
    <>
      {!password?.length ? (
        <Dialog
          maxWidth="lg"
          className="password-modal"
          open={openModal}
          onClose={handleModalClose}
        >
          <DialogTitle>
            <div className="header">
              <span className="modal-header">Password</span>
              <span className="dialog-page">
                <img
                  src={CloseBtn}
                  className="cross-btn"
                  onClick={handleModalClose}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogContent>
            <Grid item xs={12} sm={6} className="modal-content">
              <p className="info-label">Enter Password to Connect</p>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  autoComplete="off"
                  className="info-field"
                  variant="outlined"
                  placeholder="Password"
                  name="passwordConfirmation"
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  size="small"
                  type="password"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.errors.passwordConfirmation}
                </p>
              </form>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button className="add-btn" onClick={() => formik.handleSubmit()}>
              Enter
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <VncScreenDialog
          openModal={true}
          handleModalClose={handleModalClose}
          openPasswordModal={handleModalOpen}
          system={system}
          organizationId={organizationId}
          password={password}
        />
      )}
    </>
  );
};

export default PasswordDialog;
