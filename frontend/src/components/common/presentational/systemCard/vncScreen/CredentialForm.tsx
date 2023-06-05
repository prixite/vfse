import {
  Button,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { useAppSelector } from "@src/store/hooks";

const initialState = {
  username: "",
  password: "",
};

const validationSchema = yup.object({
  username: yup.string(),
  password: yup.string().required("Password is required"),
});

interface CredentialFormProps {
  setFormData: (values: { username: string; password: string }) => void;
  setStartConnection: (startConnection: boolean) => void;
  handleModalClose: () => void;
}

export const CredentialForm = ({
  setFormData,
  setStartConnection,
  handleModalClose,
}: CredentialFormProps) => {
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setFormData(values);
      setStartConnection(true);
    },
  });

  const handleClear = () => {
    handleModalClose();
    formik.resetForm();
  };

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div className="info-section">
              <p className="info-label">Username</p>
              <TextField
                autoComplete="off"
                className="info-field"
                variant="outlined"
                size="small"
                name="username"
                placeholder="Username"
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={
                  formik.touched.username &&
                  formik.errors.username && (
                    <span style={{ marginLeft: "-13px" }}>
                      {formik.errors.username}
                    </span>
                  )
                }
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            <div className="info-section">
              <p className="info-label required">Password</p>
              <TextField
                autoComplete="off"
                className="info-field"
                variant="outlined"
                size="small"
                type="password"
                name="password"
                placeholder="Password"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  formik.touched.password &&
                  formik.errors.password && (
                    <span style={{ marginLeft: "-13px" }}>
                      {formik.errors.password}
                    </span>
                  )
                }
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <DialogActions>
          <Button
            className="cancel-btn"
            style={{
              backgroundColor: secondaryColor,
              color: buttonTextColor,
            }}
            onClick={handleClear}
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
          >
            Login
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
