import { useState } from "react";

import { Box } from "@mui/material";
import moment from "moment";

import messageIcon from "@src/assets/svgs/message.svg";
import reportIcon from "@src/assets/svgs/report.svg";
import shareIcon from "@src/assets/svgs/share.svg";
import "@src/components/common/presentational/topicComment/topicComment.scss";
import { Comment } from "@src/store/reducers/generated";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(!copied);
  };

  const handleShare = () => {
    // console.log("handleShare clicked");
  };

  const handleReply = () => {
    // console.log("handleReply clicked");
  };

  return (
    <Box component="div" className="TopicCommentView">
      <div className="Comment">
        <div className="profileImage">
          <img src={profile_picture} alt="profilePicture" />
        </div>
        <div className="commentDetail">
          <div className="headerInfo">
            <p className="userName">{`${first_name} ${last_name}`}</p>
            <p className="timeStamp">{moment().startOf("minutes").fromNow()}</p>
          </div>
          <div className="commentDescription">{commentData.comment}</div>
          <div className="commentActions">
            <div className="action" onClick={handleReply}>
              <img src={messageIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">Reply</span>
            </div>
            <div className="action" onClick={handleShare}>
              <img src={shareIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">Share</span>
            </div>
            <div className="action" onClick={handleCopy}>
              <img src={reportIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">
                {!copied ? "Link" : "Copied!"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default TopicComment;
