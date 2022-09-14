import { Box, Grid, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import {
  updateUserPassword,
  updateUsernameService,
} from "@src/services/userService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useUsersChangePasswordPartialUpdateMutation,
  useUsersMePartialUpdateMutation,
} from "@src/store/reducers/generated";

import "@src/components/common/smart/accountSection/accountSection.scss";

const AccountSection = () => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { toastData } = constantsData;
  const {
    firstNameRequired,
    lastNameRequired,
    profilePictureTitle,
    oldPasswordRequired,
    passwordRequired,
    confirmPasswordRequired,
    passwordValidationError,
    somethingWrong,
    password,
    passwordsDoNotMatch,
    accountSettings,
    updateName,
    save,
    updatePasswordText,
  } = constantsData.accountSection;

  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

  const [updatePassword] = useUsersChangePasswordPartialUpdateMutation();
  const [updateUsername] = useUsersMePartialUpdateMutation();

  const nameReg = /^[A-Za-z ]*$/;
  const passwordReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const formik = useFormik({
    initialValues: {
      firstname: currentUser?.first_name || "",
      lastname: currentUser?.last_name || "",
    },
    validationSchema: yup.object({
      firstname: yup.string().matches(nameReg).required(firstNameRequired),
      lastname: yup.string().matches(nameReg).required(lastNameRequired),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      await updateUsernameService(
        {
          first_name: values?.firstname,
          last_name: values?.lastname,
          meta: {
            profile_picture: currentUser?.profile_picture,
            title: profilePictureTitle,
          },
        },
        updateUsername
      )
        .then(async () => {
          toast.success(toastData.accountSectionUsernameUpdateSuccess, {
            autoClose: timeOut,
            pauseOnHover: false,
          });
        })
        .catch((err) => {
          toastAPIError(somethingWrong, err.status, err.data);
        });
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      oldPassword: yup.string().required(oldPasswordRequired),
      password: yup
        .string()
        .required(passwordRequired)
        .matches(passwordReg, passwordValidationError),
      confirmPassword: yup
        .string()
        .required(confirmPasswordRequired)
        .when(password, {
          is: (val) => (val && val.length > 0 ? true : false),
          then: yup
            .string()

            .oneOf([yup.ref(password)], passwordsDoNotMatch),
        }),
    }),
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      await updateUserPassword(
        {
          password: values?.password,
          old_password: values?.oldPassword,
        },
        updatePassword
      ).then(() => resetForm());
    },
  });

  return (
    <div>
      <Box component="div">
        <h2>{accountSettings}</h2>
        <Box component="div" sx={{ background: "#fff" }} mt={3} mb={1} p={4}>
          <h3>{updateName}</h3>
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
                  {save}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Box
          component="div"
          sx={{ background: "#fff" }}
          my={1}
          p={4}
          marginTop="20px"
        >
          <h3>{updatePasswordText}</h3>
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
                  name="oldPassword"
                  fullWidth
                  value={passwordFormik.values.oldPassword}
                  type="password"
                  onChange={passwordFormik.handleChange}
                  variant="outlined"
                  placeholder="Old Password"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {passwordFormik.touched.oldPassword &&
                    passwordFormik.errors.oldPassword}
                </p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  name="password"
                  fullWidth
                  value={passwordFormik.values.password}
                  type="password"
                  onChange={passwordFormik.handleChange}
                  variant="outlined"
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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
                  {save}
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
