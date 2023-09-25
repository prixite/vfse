import { Box, Grid, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError, passwordReg, validUrl } from "@src/helpers/utils/utils";
import {
  updateUserPassword,
  updateUsernameService,
} from "@src/services/userService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsMeReadQuery,
  useUsersChangePasswordPartialUpdateMutation,
  useUsersMePartialUpdateMutation,
} from "@src/store/reducers/generatedWrapper";

import "@src/components/common/smart/accountSection/accountSection.scss";

const AccountSection = () => {
  const { t } = useTranslation();
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

  const [updatePassword] = useUsersChangePasswordPartialUpdateMutation();
  const [updateUsername] = useUsersMePartialUpdateMutation();

  const formik = useFormik({
    initialValues: {
      firstname: currentUser?.first_name || "",
      lastname: currentUser?.last_name || "",
      location: currentUser?.location || "",
      slacklink: currentUser?.slack_link || "",
      calenderlink: currentUser?.calender_link || "",
      zoomlink: currentUser?.zoom_link || "",
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required!"),
      lastname: yup.string().required("Last name is required!"),
      slacklink: yup.string().matches(validUrl, "Invalid URL"),
      calenderlink: yup.string().matches(validUrl, "Invalid URL"),
      zoomlink: yup.string().matches(validUrl, "Invalid URL"),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      await updateUsernameService(
        {
          first_name: values?.firstname,
          last_name: values?.lastname,
          meta: {
            profile_picture: currentUser?.profile_picture,
            title: "Profile picture",
            location: values?.location,
            slack_link: values?.slacklink,
            calender_link: values?.calenderlink,
            zoom_link: values?.zoomlink,
          },
        },
        updateUsername
      )
        .then(async () => {
          toast.success("Information successfully updated.", {
            autoClose: timeOut,
            pauseOnHover: false,
          });
        })
        .catch((err) => {
          toastAPIError("Something went wrong", err.status, err.data);
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
      oldPassword: yup.string().required("Old password is required!"),
      password: yup
        .string()
        .required("Password is required!")
        .matches(
          passwordReg,
          "Your password must be 8 characters long and a mixture of uppercase, lowercase and special characters"
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password is required!")
        .when("password", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: yup
            .string()

            .oneOf([yup.ref("password")], "Passwords do not match!"),
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
        <h2>{t("Account Settings")}</h2>
        <Box component="div" sx={{ background: "#fff" }} mt={3} mb={1} p={4}>
          <h3>{t("Update Personal Information")}</h3>
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
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="location"
                  type="text"
                  fullWidth
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Location"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="slacklink"
                  type="text"
                  fullWidth
                  value={formik.values.slacklink}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Slack link"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.touched.slacklink && formik.errors.slacklink}
                </p>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="calenderlink"
                  type="text"
                  fullWidth
                  value={formik.values.calenderlink}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Calender link"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.touched.calenderlink && formik.errors.calenderlink}
                </p>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="zoomlink"
                  type="text"
                  fullWidth
                  value={formik.values.zoomlink}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Zoom link"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.touched.zoomlink && formik.errors.zoomlink}
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
                  {t("Save")}
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
          <h3>{t("Update Password")}</h3>
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
                  {t("Save")}
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
