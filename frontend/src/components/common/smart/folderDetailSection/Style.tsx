import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(540)]: {
      gap: "1rem",
    },
  },
  card: {
    [theme.breakpoints.down(540)]: {
      height: "170px",
    },
  },
}));

export default useStyles;
