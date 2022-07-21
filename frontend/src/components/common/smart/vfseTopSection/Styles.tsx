import { makeStyles } from "@mui/styles";

interface themeTypes {
  breakpoints: unknown;
}

const useStyles = makeStyles((theme: themeTypes) => ({
  filterField: {
    minWidth: "140px",
    background: "#fff",

    [theme.breakpoints.down("sm")]: {
      minWidth: "150px",
      marginLeft: "20px",
    },
  },
  topSearchInput: {
    background: "#fff",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
      marginBottom: "10px",
      minWidth: "87%",
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "10px",
      marginBottom: "10px",
      minWidth: "59%",
    },
  },
  topBtnCreate: {
    display: "flex",
    justifyContent: "flex-end",
  },
  topBtnGrid: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "333px",
      margin: "20px 20",
      marginTop: "10px",
    },
  },
  createTopicBtn: {
    "& .css-htszrh-MuiButton-startIcon": {
      [theme.breakpoints.down(900)]: {
        margin: "0px",
      },
    },
    "& .span": {
      width: "max-content",
    },
  },
  //style for topViewBtns
  AddClientsbtn: {
    width: "190px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  btnContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  SearchInput: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    maxWidth: "100%",
    minWidth: "inherit",
    height: "100%",
    width: "100%",
    marginRight: "8px",
    // padding:"inherit",
    [theme.breakpoints.down(539)]: {
      width: "100%",
    },
    "& .MuiOutlinedInput-root": {
      height: "100%",
      minWidth: "inherit",
      backgroundColor: "#fff",
      paddingRigth: "14px",
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
    "& .input": {
      padding: "10px 16px 6px 9px",
    },
  },
}));

export default useStyles;
