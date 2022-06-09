import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
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
      maxWidth: "inherit",
      padding: "1px",
      boxSizing: "unset",
      flexGrow: "unset",
      flexBasis: "unset",
    },
  },
  timelineLeft: {
    [theme.breakpoints.down("sm")]: {
      order: "1",
    },
  },
}));

export default useStyles;
