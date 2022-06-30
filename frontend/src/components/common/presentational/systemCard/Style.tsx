import { makeStyles } from "@mui/styles";
const useStyles = makeStyles(() => ({
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
  },
  machine: {
    display: "flex",
    flexDirection: "column",
    width: "min-content",
    flexWrap: "wrap",
    marginTop: "10px",
    padding: "0px 10px",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  name: {
    // padding-bottom: 25px,
    marginBottom: "7px",
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
  },
  features: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexFlow: "column wrap",
  },
  option: {
    color: "#94989e",
    marginBottom: "18px",
  },
  titleStrong: {
    color: "black !important",
  },
  copyField: {
    marginTop: "20px",
    width: "100%",
    padding: "0 !important",
  },
  input: {
    padding: "0 !important",
    height: "40px",
    color: "#6b7280",
  },
  connectBtn: {
    width: "195px",
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
  },
  infoSection: {
    width: "23%",
    padding: "10px 0px",
    marginLeft: "5px",
    marginRight: "5%",
  },

  btnSection: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    margin: "10px 0px",
    height: "40px",
    width: "80%",
    textTransform: "capitalize",
    borderRadius: "6px",
    fontSize: "13px",
  },
  icon: {
    width: "14px",
    height: "14px",
    marginRight: "10px",
  },
  linkBtn: {
    backgroundColor: "transparent !important",
    color: "#696f77",
    border: "1px solid black",
    boxShadow: "none",
    height: "max-content",
    padding: "6px 12px",
  },
  dropdown: {
    position: "absolute",
    top: "30px",
    right: "30px",
    cursor: "pointer",
    color: "#6b7280",
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
  },
  terminalContainer: {
    marginTop: "-30px",
  },
}));

export default useStyles;
