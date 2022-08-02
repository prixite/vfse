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
  mainGrid: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },
  TimeLine: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      order: "1",
      flexBasis: "unset",
      flexGrow: "unset",
      maxWidth: "100%",
    },
  },
  recentActivity: {
    [theme.breakpoints.down("sm")]: {
      order: "2",
      display: "flex",
      flexDirection: "column-reverse",
      maxWidth: "inherit",
      padding: "1px",
      boxSizing: "unset",
      flexGrow: "unset",
      flexBasis: "unset",
      width:"100%",
    },
  },
}));

export default useStyles;
