import { useState } from "react";

import { Box } from "@mui/material";
import moment from "moment";

import messageIcon from "@src/assets/svgs/message.svg";
import shareIcon from "@src/assets/svgs/share.svg";
import "@src/components/common/presentational/topicComment/topicComment.scss";
import { Comment } from "@src/store/reducers/generated";

import TopicReply from "../topicReply/TopicReply";

interface TopicCommentProps {
  profile_picture: string;
  first_name: string;
  last_name: string;
  commentData: Comment;
}
const TopicComment = ({
  profile_picture,
  first_name,
  last_name,
  commentData,
}: TopicCommentProps) => {
<<<<<<< HEAD
  const [replyChecked, setReplyChecked] = useState<boolean>(false);
  const [shared, setShared] = useState(false);
=======
  const [copied, setCopied] = useState<boolean>(false);
  const [replyChecked, setReplyChecked] = useState<boolean>(false);
>>>>>>> c246d6f424f12c24f88d81f7da84863f309edc9b

  const handleShare = () => {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setShared(!shared);
  };

  const handleReply = () => {
    setReplyChecked((replyChecked) => !replyChecked);
  };

  return (
    <>
      <Box component="div" className="TopicCommentView">
        <div className="Comment">
          <div className="profileImage">
            <img src={profile_picture} alt="profilePicture" />
          </div>
          <div className="commentDetail">
            <div className="headerInfo">
              <p className="userName">{`${first_name} ${last_name}`}</p>
              <p className="timeStamp">
                {moment().startOf("minutes").fromNow()}
              </p>
            </div>
<<<<<<< HEAD
            <div className="commentDescription">{commentData.comment}</div>
            <div className="commentActions">
              <div
                className={!replyChecked ? "action" : "action-highlighted"}
                onClick={handleReply}
              >
                <img src={messageIcon} alt="msgIcon" className="icon" />
                <span className="actionDescription">Reply</span>
              </div>

              <div className="action" onClick={handleShare}>
                <img src={shareIcon} alt="msgIcon" className="icon" />
                <span className="actionDescription">{!shared ? "Share" : "Copied!"}</span>
              </div>
=======
            <div className="action" onClick={handleShare}>
              <img src={shareIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">
                {!shared ? "Share" : "Copied!"}
              </span>
>>>>>>> c246d6f424f12c24f88d81f7da84863f309edc9b
            </div>
          </div>
        </div>
        {replyChecked && (
          <TopicReply
            replyChecked={replyChecked}
            commentData={commentData}
            profile_picture={profile_picture}
          />
        )}
      </Box>
    </>
  );
};

export default TopicComment;
