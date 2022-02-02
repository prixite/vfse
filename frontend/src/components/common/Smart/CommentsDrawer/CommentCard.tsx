import { useEffect, useState } from "react";

import { Avatar } from "@mui/material";

import { SystemNotes } from "@src/store/reducers/api";
import "@src/components/common/Smart/CommentsDrawer/CommentCard.scss";

interface CommentProps {
  comment: SystemNotes;
}
const CommentCard = ({ comment }: CommentProps) => {
  const [readmore, setReadMore] = useState(true);
  const [isTextGreater, setIsTextGreater] = useState(false);

  useEffect(() => {
    if (comment?.note.length > 200) {
      setIsTextGreater(true);
    }
  }, [comment?.note]);
  return (
    <div className="CommentCard">
      <div className="userInfo">
        <Avatar>RJ</Avatar>
        <div className="author">
          <h3 className="author__name">{comment?.author} </h3>
          <p className="author__date">{comment?.created_at}</p>
        </div>
      </div>
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
    </div>
  );
};

export default CommentCard;
