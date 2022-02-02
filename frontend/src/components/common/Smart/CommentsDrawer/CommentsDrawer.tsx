import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { TextField, Drawer, InputAdornment, Button } from "@mui/material";
import { toast } from "react-toastify";

import { addNewSystemNoteService } from "@src/services/systemServices";
import { useAppSelector, useAppDispatch } from "@src/store/hooks";
import "@src/components/common/Smart/CommentsDrawer/CommentsDrawer.scss";
import {
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
} from "@src/store/reducers/api";
import { closeSystemDrawer } from "@src/store/reducers/appStore";

import CommentCard from "./CommentCard";
import NoCommentsFound from "./NoCommentsFound";

const CommentsDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const { fontTwo, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { openSystemNotesDrawer, systemID } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const { data: systemNotesList, refetch } = useSystemsNotesListQuery(
    {
      id: systemID,
    },
    {
      skip: !systemID,
    }
  );
  const [addNewNote] = useSystemsNotesCreateMutation();
  useEffect(() => {
    if (openSystemNotesDrawer) {
      setNote("");
    }
  }, [openSystemNotesDrawer]);
  const resetNoteHandler = () => {
    setNote("");
  };
  const SystemNoteHandler = (event) => {
    setNote(event.target.value);
  };
  const addNewComment = async () => {
    setIsLoading(true);
    if (note) {
      await addNewSystemNoteService(systemID, note, addNewNote, refetch).catch(
        () =>
          toast.error("Note not added", {
            autoClose: 1000,
            pauseOnHover: false,
          })
      );
    }
    resetNoteHandler();
    setIsLoading(false);
  };
  const generateComments = () =>
    systemNotesList.map((systemNote, index) => (
      <CommentCard key={index} comment={systemNote} />
    ));
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
          value={note}
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
                      : note
                      ? {
                          backgroundColor: buttonBackground,
                          color: buttonTextColor,
                        }
                      : {
                          backgroundColor: "lightgray",
                          color: buttonTextColor,
                        }
                  }
                  disabled={isLoading ? true : !note}
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
      <div className="CommentsSection">
        {systemNotesList && systemNotesList?.length ? (
          generateComments()
        ) : (
          <NoCommentsFound />
        )}
      </div>
    </Drawer>
  );
};

export default CommentsDrawer;
