import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  paginationStyles: {
    "& ul > li:not(:first-child):not(:last-child) > button:not(.Mui-selected)":
      {
        backgroundColor: "transparent",
        color: "grey",
        opacity: 0.6,
        fontWeight: 600,
        fontSize: 16,
      },
    "& .Mui-selected": {
      color: "#773CBD",
      fontWeight: 600,
      fontSize: 16,
    },
    "& .css-rppfq7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected": {
      backgroundColor: "transparent",
    },
    "& .css-n8417t-MuiSvgIcon-root-MuiPaginationItem-icon": {
      color: "#773CBD",
      fontSize: 30,
    },
  },
}));

export default useStyles;
