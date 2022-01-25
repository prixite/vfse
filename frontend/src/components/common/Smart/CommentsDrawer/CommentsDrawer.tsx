import { Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { TextField, Drawer, InputAdornment, Button } from "@mui/material";

import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Smart/CommentsDrawer/CommentsDrawer.scss";

interface CommentsDrawerProps {
  toggleDrawer: boolean;
  setToggleDrawer: Dispatch<SetStateAction<boolean>>;
}
const CommentsDrawer = ({
  toggleDrawer,
  setToggleDrawer,
}: CommentsDrawerProps) => {
  const { fontTwo, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <Drawer
      anchor={"right"}
      sx={{
        "& .MuiDrawer-paper": {
          width: 324,
          fontFamily: fontTwo,
          display: "flex",
          flexDirection: "column",
        },
      }}
      open={toggleDrawer}
      onClose={() => setToggleDrawer(false)}
      hideBackdrop={true}
    >
      <div className="DrawerHeader">
        <h3 className="title">Comments</h3>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => setToggleDrawer(false)}
        />
      </div>
      <div className="AddComment">
        <TextField
          multiline
          minRows={4}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                  className="AddCommentBtn"
                >
                  Add
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </Drawer>
  );
};

export default CommentsDrawer;
