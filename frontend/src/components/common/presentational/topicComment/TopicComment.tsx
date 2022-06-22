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
  const [replyChecked, setReplyChecked] = useState<boolean>(false);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    navigator.clipboard.writeText(commentData?.comment);
    setTimeout(() => {
      setShared(false);
    }, 2500);
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
                {moment(commentData?.created_at).startOf("s").fromNow()}
              </p>
            </div>
            <div className="commentDescription">{commentData.comment}</div>
            <div className="commentActions">
              <div
                className={!replyChecked ? "action" : "action-highlighted"}
                onClick={handleReply}
              >
                <img src={messageIcon} alt="msgIcon" className="icon" />
                <span className="actionDescription">Reply</span>
              </div>

              <div
                className={!shared ? "action" : "action-highlighted"}
                onClick={handleShare}
              >
                <img src={shareIcon} alt="msgIcon" className="icon" />
                <span className="actionDescription">
                  {!shared ? "Share" : "Copied!"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {replyChecked && (
          <TopicReply replyChecked={replyChecked} commentData={commentData} />
        )}
      </Box>
    </>
  );
};

export default TopicComment;
