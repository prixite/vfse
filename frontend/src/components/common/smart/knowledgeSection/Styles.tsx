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
  seeAll: {
    textDecoration: "none",
    color: "rgb(119, 60, 189)",
  },
  knowledgeBaseCardsContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      height: "240px",
      flexDirection: "column",
      overflowX: "scroll",
      overflowY: "hidden",
      justifyContent: "space-between",
      flexWrap: "wrap",
      padding: "revert",
    },
  },
  knowledgeTopCard: {
    width: "205px",
  },
}));

export default useStyles;
