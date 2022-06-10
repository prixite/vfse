import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: " 8px",
    background: "white",
    boxShadow: "3px 3px 12px rgba(10, 35, 83, 0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "16px",
    fontFamily: "ProximaNova-Regular",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center",
    color: "#696f77",
  },
  togglers: {},
  setter: {
    backgroundColor: "unset !important",
    background: "unset !important",
    border: "unset",
    padding: "unset",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customToggleBtn: {
    backgroundColor: "unset !important",
    background: "unset !important",
    border: "unset",
    padding: "unset",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "36px",
  },
  choiceDescription: {
    textTransform: "capitalize",
    fontSize: "15px",
    fontWeight: "400",
    color: "#696f77",
    marginLeft: "10px",
  },
  grouped: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useStyles;
