import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  knowledgeSection: {
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
      position: "relative",
    },
  },
  tabStyle: {
    marginRight: "40px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#696f77",
    padding: "10px 6px",
  },
  mainHeading: {
    fontFamily: "ProximaNova-Extrabold",
    fontSize: "28px",
  },
  subHeading: {
    margin: "24px 0",
    fontFamily: "ProximaNova-Extrabold",
    fontSize: "22px",
  },
  optionsDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsIcon: {
    color: "rgb(119, 60, 189)",
    marginRight: "1.3rem",
    cursor: "pointer",
  },
  seeAllDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDiv: {
    minWidth: "275px",
    height: "168px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    boxShadow: "3px 3px 12px rgba(10, 35, 83, 0.08)",
  },
  errorDiv: {
    fontFamily: "ProximaNova-Extrabold",
    fontSize: "20px",
    fontWeight: "semibold",
    color: "#696f77",
  },
  seeAll: {
    textDecoration: "none",
    color: "rgb(119, 60, 189)",
  },
}));

export default useStyles;
