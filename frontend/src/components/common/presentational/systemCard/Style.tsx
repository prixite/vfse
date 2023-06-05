import { makeStyles } from "@mui/styles";

interface Theme {
  breakpoints: {
    down: unknown;
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  systemCard: {
    position: "relative",
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "auto",
    padding: "18px 30px",
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "600",
    backgroundColor: "white",
    borderRadius: "4px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.down(800)]: {
      padding: "18px 0px",
    },
  },
  machine: {
    display: "flex",
    flexDirection: "column",
    width: "min-content",
    flexWrap: "wrap",
    marginTop: "10px",
    padding: "0px 10px",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: "25px",
    [theme.breakpoints.down(800)]: {
      padding: "0",
      paddingRight: "5px",
      justifyContent: "flex-start",
      alignItems: "baseline",
      width: "40%",
      marginRight: "10px",
    },
  },
  name: {
    // padding-bottom: 25px,
    marginBottom: "7px",
    alignSelf: "flex-start",
  },
  image: {
    width: "100%",
    height: "45%",
    objectFit: "contain",
  },

  featuresSection: {
    display: "flex",
    flexDirection: "column",
    // justify-content: space-between,
    width: "45%",
    padding: "0px 50px",
    marginTop: "10px",
    borderLeft: "1px solid #d4d6db",
    borderRight: "1px solid #d4d6db",
    [theme.breakpoints.down(800)]: {
      display: "flex",
      width: "40%",
      padding: "0px 5px",
      paddingRight: "30px",
      flexWrap: "wrap",
      flexDirection: "row",
      paddingLeft: "10px",
    },
  },
  features: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexFlow: "column wrap",
  },
  featuresOptions: {
    marginRight: "32px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      flexDirection: "column",
    },
  },
  option: {
    color: "#94989e",
    marginBottom: "18px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexWrap: "wrap",
      overflowWrap: "break-word",
      alignSelf: "flex-start",
      justiyContent: "baseline",
    },
  },
  titleStrong: {
    color: "black !important",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      flexWrap: "wrap",
      overFlowWrap: "anywhere",
    },
  },
  copyField: {
    marginTop: "20px",
    width: "100%",
    padding: "0 !important",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0",
      width: "100%",
      height: "min-content",

      "&. MuiOutlinedInput": {
        display: "none",
      },
    },
  },
  "&. MuiOutlinedInput": {
    display: "none",
  },
  input: {
    padding: "0 !important",
    height: "40px",
    color: "#6b7280",
    [theme.breakpoints.down("sm")]: {},
  },
  connectBtn: {
    width: "195px",
    "&:disabled": {
      backgroundColor: "grey !important",
    },
    [theme.breakpoints.down(800)]: {
      width: "inherit",
      height: "inherit",
    },
  },

  copyBtn: {
    width: "96px",
    background: "#d9dbdd",
    borderRadius: "6px",
    height: "32px",
    fontSize: "13px",
    color: "black",
    marginRight: "-4px",
    textTransform: "capitalize",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  infoSection: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    width: "23%",
    padding: "10px 0px",
    marginLeft: "5px",
    marginRight: "5%",
    [theme.breakpoints.down("sm")]: {
      marginRight: "5%",
      width: "30%",
      paddingLeft: "5px",
    },
  },
  "&. $css-i4bv87-MuiSvgIcon-root": {
    [theme.breakpoints.down("sm")]: {
      top: "30px",
      right: "15px",
    },
  },
  btnSection: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down(800)]: {
      alignSelf: "center",
      width: "88%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "30px",
    },
  },
  button: {
    margin: "10px 0px",
    height: "40px",
    width: "80%",
    textTransform: "capitalize",
    borderRadius: "6px",
    fontSize: "13px",
    [theme.breakpoints.down("sm")]: {},
  },
  icon: {
    width: "14px",
    height: "14px",
    marginRight: "10px",
    [theme.breakpoints.down("sm")]: {},
  },
  linkBtn: {
    backgroundColor: "transparent !important",
    color: "#696f77",
    border: "1px solid black",
    boxShadow: "none",
    height: "max-content",
    marginTop: "4px",
    padding: "6px 12px",
    [theme.breakpoints.down("sm")]: {},
  },
  dropdown: {
    position: "absolute",
    top: "30px",
    right: "30px",
    cursor: "pointer",
    color: "#6b7280",
    [theme.breakpoints.down("sm")]: {},
  },

  // .system-dropdownMenu {
  //   .MuiPaper-elevation {
  //     transform: translate(-5px, 10px) !important,
  //   }
  //   ul {
  //     width: 170px,
  //     margin-top: 10px,
  //     li {
  //       font-weight: 400,
  //       font-size: 16px,
  //       width: 100%,
  //       color: #111827,
  //       padding: 4px,
  //       margin-bottom: 5px,
  //     }
  //   }

  submitProgress: {
    marginLeft: "10px",
    [theme.breakpoints.down("sm")]: {},
  },
  terminalContainer: {
    marginTop: "-30px",
    [theme.breakpoints.down("sm")]: {},
  },
}));

export default useStyles;
