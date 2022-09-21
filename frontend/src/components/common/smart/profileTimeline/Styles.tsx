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
  paginationStyles: {
    "& ul > li:not(:first-child):not(:last-child) > button:not(.Mui-selected)":
      {
        backgroundColor: "transparent",
        color: "grey",
        opacity: 0.6,
        fontWeight: 900,
        fontSize: 20,
      },
    "& .Mui-selected": {
      color: "#773CBD",
      fontWeight: 900,
      fontSize: 20,
    },
    "& .css-rppfq7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected": {
      backgroundColor: "transparent",
    },
    "& .css-n8417t-MuiSvgIcon-root-MuiPaginationItem-icon": {
      color: "#773CBD",
      fontSize: 35,
    },
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
