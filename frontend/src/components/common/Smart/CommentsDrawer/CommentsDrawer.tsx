
import { useEffect , useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, Drawer, InputAdornment, Button } from "@mui/material";

import { useAppSelector,useAppDispatch } from "@src/store/hooks";
import "@src/components/common/Smart/CommentsDrawer/CommentsDrawer.scss";
import { closeSystemDrawer } from "@src/store/reducers/appStore";
import { useSystemsNotesListQuery,useSystemsNotesCreateMutation } from "@src/store/reducers/api";
import { addNewSystemNoteService } from "@src/services/systemServices";
import NoCommentsFound from "./NoCommentsFound";


const CommentsDrawer = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [note,setNote] = useState("");
  const { fontTwo, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const {openSystemNotesDrawer,systemID} = useAppSelector((state)=>state.app);
  const dispatch = useAppDispatch();
  const {data : systemNotesList , isFetching , refetch} = useSystemsNotesListQuery({
    id : systemID
  },{
    skip : !systemID
  } 
  );
console.log(systemNotesList , "system Notes List");
console.log(isLoading);
  const [addNewNote] = useSystemsNotesCreateMutation();
 const resetNoteHandler = () => {
   setNote("");
 }
 const SystemNoteHandler = (event) => {
   setNote(event.target.value);
 }
 const addNewComment = async () => {
    setIsLoading(true);
    if(note)
    {
      await addNewSystemNoteService(systemID,note,addNewNote,refetch)
            .catch((err)=>console.log(err));
    }
    resetNoteHandler();
    setIsLoading(false);
 }
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
          value = {note}
          onChange={SystemNoteHandler}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                    style={
                      isLoading
                        ? {
                            backgroundColor: "lightgray",
                            color: buttonTextColor,
                          }
                        : {
                            backgroundColor: buttonBackground,
                            color: buttonTextColor,
                          }
                    }
                  disabled = {isLoading}
                  className="AddCommentBtn"
                  onClick={addNewComment}
                >
                  Add
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className = "CommentsSection">
        {
          systemNotesList && systemNotesList?.length 
          ?
          <h1>Comments Exist </h1>
          : <NoCommentsFound/>
        }
      </div>
    </Drawer>
  );
};

export default CommentsDrawer;
