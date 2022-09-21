import { makeStyles } from "@mui/styles";

interface Theme {
  breakpoints: {
    down: (a: string) => string;
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  timelineSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "16px",
    marginRight: "auto",
    overflow: "auto",
  },
  mainProfileGrid: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },
  profileTimeLine: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      order: "2",
      flexBasis: "unset",
      flexGrow: "unset",
      maxWidth: "100%",
    },
  },
  recentActivity: {
    [theme.breakpoints.down("sm")]: {
      order: 1,
      display: "flex",
      flexDirection: "column-reverse",
      maxWidth: "100%",
      padding: "1px",
    },
  },
  timelineLeft: {
    [theme.breakpoints.down("sm")]: {
      order: "1",
    },
  },
}));

export default useStyles;
