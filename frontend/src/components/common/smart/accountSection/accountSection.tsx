import { Box, Grid, TextField, Button } from "@mui/material";

import { useAppSelector } from "@src/store/hooks";

const AccountSection = () => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

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
          <Grid
            container
            rowSpacing={3}
            marginTop=".1rem"
            direction="column"
            width={{ xs: "100%", lg: "40%" }}
          >
            <Grid item xs={12}>
              {/* <h4 style={{ marginBottom: "5px" }}>User name</h4> */}
              <TextField fullWidth label={"Username"} variant="outlined" />
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
        </Box>
        <Box
          component="div"
          sx={{ background: "#fff", borderRadius: "8px" }}
          my={1}
          p={4}
          marginTop="20px"
        >
          <h3>{"Update Password"}</h3>
          <Grid
            container
            rowSpacing={3}
            direction="column"
            marginTop=".1rem"
            width={{ xs: "100%", lg: "40%" }}
          >
            <Grid item xs={12}>
              {/* <h4 style={{ marginBottom: "5px" }}>Password</h4> */}
              <TextField
                fullWidth
                type="password"
                label={"Password"}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              {/* <h4 style={{ marginBottom: "5px" }}>Confirm password</h4> */}
              <TextField
                fullWidth
                type="password"
                label={"Confirm password"}
                variant="outlined"
              />
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
        </Box>
      </Box>
    </div>
  );
};

export default AccountSection;
