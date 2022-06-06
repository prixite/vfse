import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  forumHeader: {
    display: "flex",
    justifyContent: "space-between",
    height: "47px",
  },
  AddTopicsbtn: {
    width: "unset",
    textAlign: "center",
    minWidth: "unset",
    padding: "4px 12px",
  },
  btnContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default useStyles;
