import { Box, Grid, TextField, Button } from "@mui/material";

import { useAppSelector } from "@src/store/hooks";

const AccountSection = () => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  return (
    <div>
      <Box component="div" p={4}>
        <h1>Profile settings</h1>;
        <Box component="div" sx={{ background: "#fff" }} m={1} p={4}>
          <Grid container rowSpacing={3} direction="column" width="40%">
            <Grid item xs={4}>
              <h4 style={{ marginBottom: "5px" }}>User name</h4>
              <TextField
                disabled
                fullWidth
                label={"User name"}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} alignSelf="end">
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
          sx={{ background: "#fff" }}
          m={1}
          p={4}
          marginTop="20px"
        >
          <Grid
            container
            rowSpacing={3}
            direction="column"
            width="70%"
            marginTop="40px"
          >
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <h4 style={{ marginBottom: "5px" }}>Password</h4>
                <TextField
                  disabled
                  fullWidth
                  label={"Password"}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <h4 style={{ marginBottom: "5px" }}>Confirm password</h4>
                <TextField
                  disabled
                  fullWidth
                  label={"Confirm password"}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid item xs={6} alignSelf="end">
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
