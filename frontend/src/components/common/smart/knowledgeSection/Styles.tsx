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
  seeAllDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    textDecoration: "none",
    color: "rgb(119, 60, 189)",
  },
}));

export default useStyles;
