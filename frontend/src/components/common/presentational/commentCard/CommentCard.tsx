import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";

// import DeleteLogo from "@src/assets/svgs/delete.svg";
// import EditLogo from "@src/assets/svgs/edit.svg";
import EditComment from "@src/components/common/smart/commentsDrawer/editComment/EditComment";
import DeleteNoteModal from "@src/components/shared/popUps/deleteNoteModal/DeleteNoteModal";
import { toastAPIError } from "@src/helpers/utils/utils";
import { deleteSystemNoteService } from "@src/services/systemServices";
import { SystemNotes, useNotesDeleteMutation } from "@src/store/reducers/api";
import "@src/components/common/presentational/commentCard/commentCard.scss";

interface CommentProps {
  comment: SystemNotes;
  userId: number;
}
const CommentCard = ({ comment, userId }: CommentProps) => {
  const [readmore, setReadMore] = useState(true);
  const [isTextGreater, setIsTextGreater] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteNote] = useNotesDeleteMutation();
  const handleClose = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    if (comment?.note.length > 200) {
      setIsTextGreater(true);
    }
  }, [comment?.note]);

  const handleNoteDelete = async () => {
    await deleteSystemNoteService(comment?.id, deleteNote)
      // .catch(() => {
      //   toast.error("Comment Failed to Delete", {
      //     autoClose: 1000,
      //     pauseOnHover: true,
      //   });
      // });
      .catch((error) =>
        toastAPIError("Comment Failed to Delete.", error?.status, error?.data)
      );
    handleClose();
  };
  return (
    <>
      <div className="CommentCard">
        <div className="commentHeader">
          <div className="userInfo">
            <Avatar alt="author Image" src={comment?.author_image} />
            <div className="author">
              <h3 className="author__name">{comment?.author_full_name} </h3>
              <p className="author__date">{comment?.created_at}</p>
            </div>
          </div>
          {userId === comment?.author ? (
            <div className="userActions">
              {!editMode ? (
                <>
                  {/* <img
                    src={EditLogo}
                    className="logo deleteLogo"
                    onClick={() => setEditMode(true)}
                  />
                  <img
                    src={DeleteLogo}
                    className="logo deleteLogo"
                    onClick={() => setOpenModal(true)}
                  /> */}
                </>
              ) : (
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditMode(false)}
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        {!editMode ? (
          <div className="note">
            {!isTextGreater ? (
              <p className="note__description">{comment?.note}</p>
            ) : (
              <>
                {
                  <p className="note__description">
                    {readmore ? comment?.note.slice(0, 200) : comment?.note}
                    <span
                      className="read-or-hide"
                      onClick={() => setReadMore((prevState) => !prevState)}
                    >
                      {readmore ? "...read more" : " read less"}
                    </span>
                  </p>
                }
              </>
            )}
          </div>
        ) : (
          <EditComment
            note={comment?.note}
            noteId={comment?.id}
            setEditMode={setEditMode}
          />
        )}
      </div>
      <DeleteNoteModal
        handleNoteDelete={handleNoteDelete}
        open={openModal}
        handleClose={handleClose}
      />
    </>
  );
};

export default CommentCard;
