import { useState, Dispatch, SetStateAction } from "react";

import "@src/components/common/smart/commentsDrawer/editComment/editComment.scss";
import { TextField, InputAdornment, Button } from "@mui/material";
import { toast } from "react-toastify";

import { updateSystemNoteService } from "@src/services/systemServices";
import { useAppSelector } from "@src/store/hooks";
import { useNotesPartialUpdateMutation } from "@src/store/reducers/api";
interface EditCommentProps {
  noteId: number;
  note: string;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
const EditComment = ({ note, noteId, setEditMode }: EditCommentProps) => {
  const [editNote, setEditNote] = useState(note);
  const [isLoading, setIsLoading] = useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const [updateNote] = useNotesPartialUpdateMutation();
  const SystemNoteHandler = (event) => {
    setEditNote(event.target.value);
  };
  const editCommentHandler = async () => {
    setIsLoading(true);
    await updateSystemNoteService(noteId, editNote, updateNote).catch(() => {
      toast.error("Failed to update comment", {
        autoClose: 1000,
        pauseOnHover: true,
      });
    });
    setEditMode(false);
  };
  return (
    <>
      <div className="EditComment">
        <div className="AddComment">
          <TextField
            autoComplete="off"
            multiline
            minRows={4}
            fullWidth
            value={editNote}
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
                        : editNote
                        ? {
                            backgroundColor: buttonBackground,
                            color: buttonTextColor,
                          }
                        : {
                            backgroundColor: "lightgray",
                            color: buttonTextColor,
                          }
                    }
                    disabled={isLoading ? true : !editNote}
                    className="AddCommentBtn"
                    onClick={editCommentHandler}
                  >
                    Save
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditComment;
