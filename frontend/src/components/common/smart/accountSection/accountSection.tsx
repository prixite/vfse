import { useState } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import * as yup from "yup";
import { useAppSelector } from "@src/store/hooks";
import { useFormik } from "formik";
import "@src/components/common/smart/accountSection/accountSection.scss";

const AccountSection = () => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const nameReg = /^[A-Za-z ]*$/;
  const passwordReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
    },
    validationSchema: yup.object({
      firstname: yup
        .string()
        .matches(nameReg)
        .required("First name is required!"),
      lastname: yup
        .string()
        .matches(nameReg)
        .required("Last name is required!"),
    }),
    validateOnChange: true,
    onSubmit: () => {},
  });

  const passwordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .required("Password is required!")
        .matches(
          passwordReg,
          "Your password must be 8 characters long and a mixture of uppercase, lowercase and special characters"
        ),
      confirmPassword: yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup
          .string()
          .required("Confirm password is required!")
          .oneOf([yup.ref("password")], "Passwords do not match!"),
      }),
    }),
    validateOnChange: true,
    onSubmit: () => {},
  });

  return (
    <div>
      <Box component="div">
        <h2>{"Account Settings"}</h2>
        <Box
          component="div"
          sx={{ background: "#fff", borderRadius: "8px" }}
          mt={3}
          mb={1}
          p={4}
        >
          <h3>{"Update Name"}</h3>
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              rowSpacing={3}
              marginTop=".1rem"
              direction="column"
              width={{ xs: "100%", lg: "40%" }}
            >
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="firstname"
                  fullWidth
                  value={formik.values.firstname}
                  type="text"
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="First Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.touched.firstname && formik.errors.firstname}
                </p>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="lastname"
                  type="text"
                  fullWidth
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Last Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.touched.lastname && formik.errors.lastname}
                </p>
              </Grid>
              <Grid item xs={12} alignSelf="end">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Box
          component="div"
          sx={{ background: "#fff", borderRadius: "8px" }}
          my={1}
          p={4}
          marginTop="20px"
        >
          <h3>{"Update Password"}</h3>
          <form onSubmit={passwordFormik.handleSubmit}>
            <Grid
              container
              rowSpacing={3}
              direction="column"
              marginTop=".1rem"
              width={{ xs: "100%", lg: "40%" }}
            >
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  name="password"
                  fullWidth
                  value={passwordFormik.values.password}
                  type="password"
                  onChange={passwordFormik.handleChange}
                  variant="outlined"
                  placeholder="Password"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {passwordFormik.touched.password &&
                    passwordFormik.errors.password}
                </p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  name="confirmPassword"
                  fullWidth
                  value={passwordFormik.values.confirmPassword}
                  type="password"
                  onChange={passwordFormik.handleChange}
                  variant="outlined"
                  placeholder="Confirm Password"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword}
                </p>
              </Grid>
              <Grid item xs={12} alignSelf="end">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default AccountSection;
