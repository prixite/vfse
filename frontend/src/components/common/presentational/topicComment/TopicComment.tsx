import { useState } from "react";

import { Box, Grid } from "@mui/material";
import moment from "moment";

import replyIcon from "@src/assets/images/replyIcon.png";
import messageIcon from "@src/assets/svgs/message.svg";
import shareIcon from "@src/assets/svgs/share.svg";
import "@src/components/common/presentational/topicComment/topicComment.scss";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { Comment } from "@src/store/reducers/generated";

import TopicReply from "../topicReply/TopicReply";
interface TopicCommentProps {
  commentData: Comment;
}
const TopicComment = ({ commentData }: TopicCommentProps) => {
  const [browserWidth] = useWindowSize();
  const [replyChecked, setReplyChecked] = useState<boolean>(false);
  const [shared, setShared] = useState(false);
  const { number_of_replies: numberOfReplies } = commentData;
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
            <img src={commentData?.user_profile?.image} alt="profilePicture" />
          </div>
          <div className="commentDetail">
            <div className="headerInfo">
              <p className="userName">{`${commentData?.user_profile?.name}`}</p>
              <p className="timeStamp">
                {moment(commentData?.created_at).startOf("s").fromNow()}
              </p>
            </div>
            {browserWidth > mobileWidth ? (
              <>
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
                {numberOfReplies > 0 && (
                  <div onClick={handleReply} className="replyIconElement">
                    <img src={replyIcon} alt="replyIcon" />
                    <span className="replyIconText">
                      {numberOfReplies > 1
                        ? numberOfReplies + " Replies"
                        : numberOfReplies + " Reply"}
                    </span>
                  </div>
                )}
                {replyChecked && (
                  <TopicReply
                    replyChecked={replyChecked}
                    commentData={commentData}
                  />
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        {browserWidth < mobileWidth ? (
          <>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className="commentDescription"
              style={{
                margin: "5px 0px",
                lineHeight: "1.5",
                wordBreak: "break-all",
              }}
            >
              {commentData.comment}
            </Grid>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className="commentActions"
              style={{ marginTop: "5px", marginBottom: "0px" }}
            >
              <Grid
                xs={4}
                sm={4}
                md={4}
                lg={4}
                className={!replyChecked ? "action" : "action-highlighted"}
                onClick={handleReply}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <img
                  src={messageIcon}
                  alt="msgIcon"
                  className="icon"
                  style={{
                    width: "30px",
                    marginRight: "5px",
                  }}
                />
                <span
                  className="actionDescription"
                  style={replyChecked ? { color: "#661bc0" } : {}}
                >
                  Reply
                </span>
              </Grid>

              <Grid
                xs={4}
                sm={4}
                md={4}
                lg={4}
                className={!shared ? "action" : "action-highlighted"}
                onClick={handleShare}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <img
                  src={shareIcon}
                  style={{
                    width: "30px",
                    marginRight: "5px",
                  }}
                  alt="msgIcon"
                  className="icon"
                />
                <span className="actionDescription">
                  {!shared ? "Share" : "Copied!"}
                </span>
              </Grid>
              <Grid xs={4} sm={4} md={4} lg={4}></Grid>
            </Grid>
            {numberOfReplies > 0 && (
              <Grid
                onClick={handleReply}
                className="replyIconElement"
                style={{ marginLeft: "5px" }}
              >
                <img src={replyIcon} alt="replyIcon" />
                <span className="replyIconText">
                  {numberOfReplies > 1
                    ? numberOfReplies + " Replies"
                    : numberOfReplies + " Reply"}
                </span>
              </Grid>
            )}
            {replyChecked && (
              <TopicReply
                replyChecked={replyChecked}
                commentData={commentData}
              />
            )}
          </>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default TopicComment;
