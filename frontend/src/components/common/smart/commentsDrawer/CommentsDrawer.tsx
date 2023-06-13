import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { TextField, Drawer, InputAdornment, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import CommentCard from "@src/components/common/presentational/commentCard/CommentCard";
import NoCommentsFound from "@src/components/common/presentational/noCommentsFound/NoCommentsFound";
import { toastAPIError } from "@src/helpers/utils/utils";
import { addNewSystemNoteService } from "@src/services/systemServices";
import {
  useAppSelector,
  useAppDispatch,
  useSelectedOrganization,
} from "@src/store/hooks";
import "@src/components/common/smart/commentsDrawer/commentsDrawer.scss";
import {
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useOrganizationsMeReadQuery,
} from "@src/store/reducers/api";
import { closeSystemDrawer } from "@src/store/reducers/appStore";

const CommentsDrawer = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const { fontTwo, buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const { openSystemNotesDrawer, systemID } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const { data: systemNotesList } = useSystemsNotesListQuery(
    {
      id: systemID,
    },
    {
      skip: !systemID,
    }
  );
  const { data: me } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
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
      await addNewSystemNoteService(me?.id, systemID, note, addNewNote).catch(
        (err) => toastAPIError("Note not added", err.status, err.data)
      );
    }
    resetNoteHandler();
    setIsLoading(false);
  };
  const generateComments = () =>
    systemNotesList.map((systemNote, index) => (
      <CommentCard key={index} comment={systemNote} userId={me?.id} />
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
        <h3 className="title">{t("Comments")}</h3>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(closeSystemDrawer())}
        />
      </div>
      <div className="AddComment">
        <TextField
          autoComplete="off"
          multiline
          minRows={4}
          fullWidth
          placeholder="Add a new comment"
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
                  className="AddSystemCommentBtn"
                  onClick={addNewComment}
                >
                  {t("Add")}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {systemNotesList && systemNotesList?.length ? (
        <div className="CommentsSection">{generateComments()}</div>
      ) : (
        <div className="CommentsSection" style={{ margin: "auto" }}>
          <NoCommentsFound />
        </div>
      )}
    </Drawer>
  );
};

export default CommentsDrawer;
