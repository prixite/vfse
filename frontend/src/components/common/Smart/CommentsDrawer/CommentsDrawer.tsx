

import CloseIcon from "@mui/icons-material/Close";
import { TextField, Drawer, InputAdornment, Button } from "@mui/material";

import { useAppSelector,useAppDispatch } from "@src/store/hooks";
import "@src/components/common/Smart/CommentsDrawer/CommentsDrawer.scss";
import { closeSystemDrawer } from "@src/store/reducers/appStore";


const CommentsDrawer = () => {
  const { fontTwo, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const {openSystemNotesDrawer} = useAppSelector((state)=>state.app);
  const dispatch = useAppDispatch();
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
      open={openSystemNotesDrawer}
      onClose={() => dispatch(closeSystemDrawer())}
      hideBackdrop={true}
    >
      <div className="DrawerHeader">
        <h3 className="title">Comments</h3>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(closeSystemDrawer())}
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
