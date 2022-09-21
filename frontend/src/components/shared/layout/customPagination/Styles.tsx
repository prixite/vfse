import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
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
}));

export default useStyles;
