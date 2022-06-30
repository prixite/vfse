import { makeStyles } from "@mui/styles";

interface themeTypes {
  breakpoints:{
    down: (a: string) => string;
  } 
}

const useStyles = makeStyles((theme: themeTypes) => ({
  sortByField: {
    minWidth: "200px",
    background: "#fff",
    [theme.breakpoints.down("sm")]: {
      minWidth: "150px",
    },
  },
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
    width: "max-content",
  },
  SearchInput: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    maxWidth: "65%",
    height: "100%",
    "& .MuiOutlinedInput-root": {
      height: "100%",
      backgroundColor: "#fff",
      marginRight: "10px",
      [theme.breakpoints.down("sm")]: {},
    },
    "& .input": {
      padding: "10px 16px 6px 9px",
    },
  },
}));

export default useStyles;
