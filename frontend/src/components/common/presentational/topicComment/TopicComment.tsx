import { useState, useRef } from "react";

import { Box, Grid } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";

import replyIcon from "@src/assets/images/replyIcon.png";
import messageIcon from "@src/assets/svgs/message.svg";
import shareIcon from "@src/assets/svgs/share.svg";
import "@src/components/common/presentational/topicComment/topicComment.scss";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { Comment } from "@src/store/reducers/generatedWrapper";

import TopicReply from "../topicReply/TopicReply";
interface TopicCommentProps {
  commentData: Comment;
}
const TopicComment = ({ commentData }: TopicCommentProps) => {
  const { t } = useTranslation();
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

  const replyRef = useRef(null);
  const scrollToTopReply = () =>
    replyRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <Box component="div" className="TopicCommentView">
        <div className="Comment" ref={replyRef}>
          <div className="profileImage">
            <img src={commentData?.user_profile?.image} alt="profilePicture" />
          </div>
          <div
            className="commentDetail"
            style={browserWidth < mobileWidth ? { margin: "10px" } : {}}
          >
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
                    <span className="actionDescription">{t("Reply")}</span>
                  </div>

                  <div
                    className={!shared ? "action" : "action-highlighted"}
                    onClick={handleShare}
                  >
                    <img src={shareIcon} alt="msgIcon" className="icon" />
                    <span className="actionDescription">
                      {!shared ? "Shared" : "Copied"}
                    </span>
                  </div>
                </div>
                {numberOfReplies > 0 && (
                  <div onClick={handleReply} className="replyIconElement">
                    <img src={replyIcon} alt="replyIcon" />
                    <span className="replyIconText">
                      {numberOfReplies > 1
                        ? numberOfReplies + "Replies"
                        : numberOfReplies + "Reply"}
                    </span>
                  </div>
                )}
                {replyChecked && (
                  <TopicReply
                    replyChecked={replyChecked}
                    commentData={commentData}
                    scrollToTopReply={scrollToTopReply}
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
                margin: "8px 0px",
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}
            >
              {commentData.comment}
            </Grid>
            <Grid>
              <Grid
                container
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className="commentActions"
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
                    style={
                      replyChecked
                        ? {
                            color: "#661bc0",
                            fontWeight: "600",
                            fontSize: "1rem",
                          }
                        : {
                            color: "gray",
                            fontWeight: "600",
                            fontSize: "1rem",
                          }
                    }
                  >
                    {t("Reply")}
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
                  <span
                    className="actionDescription"
                    style={
                      shared
                        ? {
                            color: "#661bc0",
                            fontWeight: "600",
                            fontSize: "1rem",
                          }
                        : {
                            color: "gray",
                            fontWeight: "600",
                            fontSize: "1rem",
                          }
                    }
                  >
                    {!shared ? "Shared" : "Copied"}
                  </span>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}></Grid>
              </Grid>
              {numberOfReplies > 0 && (
                <Grid
                  onClick={handleReply}
                  className="replyIconElement"
                  marginLeft={1}
                >
                  <img src={replyIcon} alt="replyIcon" />
                  <span
                    className="replyIconText"
                    style={
                      replyChecked ? { color: "#661bc0" } : { color: "gray" }
                    }
                  >
                    {numberOfReplies > 1
                      ? numberOfReplies + "Replies"
                      : numberOfReplies + "Reply"}
                  </span>
                </Grid>
              )}
            </Grid>
            {replyChecked && (
              <TopicReply
                replyChecked={replyChecked}
                commentData={commentData}
                scrollToTopReply={scrollToTopReply}
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
