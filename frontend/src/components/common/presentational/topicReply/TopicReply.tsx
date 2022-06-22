import { useEffect, useState } from "react";

import { Avatar, Box, Button, Input, Skeleton } from "@mui/material";
import "@src/components/common/presentational/topicReply/topicReply.scss";
import moment from "moment";

import { api, VfseCommentsRepliesCreateApiArg } from "@src/store/reducers/api";
import { Comment } from "@src/store/reducers/generated";

type TopicReplyProps = {
  commentData: Comment;
  replyChecked: boolean;
};

function TopicReply({ commentData, replyChecked }: TopicReplyProps) {
  const [commentIDState, setCommentIDState] = useState<number>(commentData?.id);
  const [topicIDState, setTopicIDState] = useState<number>(commentData?.topic);
  const [, setUserIDState] = useState<number>(commentData?.user);

  //GET vfseCommentsRepliesCreate
  const { data: repliesData = [], isLoading: isRepliesLoading } =
    api.useVfseCommentsRepliesListQuery({
      //remove  Refetch
      id: commentIDState,
      topic: topicIDState,
    });

  //POST vfseCommentsRepliesCreate
  const [addReply] = api.useVfseCommentsRepliesCreateMutation();

  const [reply, setReply] = useState<string>("");
  const [isReplyPosting, setIsReplyPosting] = useState<boolean>(false);

  useEffect(() => {
    setCommentIDState(commentData?.id);
    setTopicIDState(commentData?.topic);
    setUserIDState(commentData?.user);
  }, [replyChecked, commentData, repliesData]);

  const addReplyHandler = () => {
    const payload: VfseCommentsRepliesCreateApiArg = {
      id: commentIDState,
      comment: {
        comment: reply,
        topic: topicIDState,
      },
    };
    setIsReplyPosting(true);
    addReply(payload)
      .unwrap()
      .finally(() => {
        setReply("");
        setIsReplyPosting(false);
      });
  };

  return (
    <Box className="TopicReplyView">
      {/* Replied start  */}
      {/* Replied end  */}
      <div>
        {!isRepliesLoading ? (
          <div>
            {repliesData.map((item, key) => (
              <div key={key} className="Comment" style={{ margin: "5px" }}>
                <div className="profileImage">
                  <img src={item?.user_profile?.image} alt="profilePicture" />
                </div>
                <div className="commentDetail">
                  <div className="headerInfo">
                    <p className="userName">{`${item?.user_profile?.name}`}</p>
                    {moment(item?.created_at).startOf("minutes").fromNow()}
                  </div>
                  <div className="commentDescription">{item.comment}</div>
                  <div className="commentActions"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Box component="div" style={{ width: "100%", marginTop: "16px" }}>
            <Box
              component="div"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton
                animation="wave"
                height={20}
                width="60%"
                style={{ marginLeft: 10 }}
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="200px"
              style={{ marginTop: "16px" }}
            >
              <div />
            </Skeleton>
          </Box>
        )}
      </div>
      <Box component="div" className="commentActions">
        <div className="profileImage">
          <img src={commentData?.user_profile.image} alt="profilePicture" />
        </div>
        <Input
          className="commentInput"
          placeholder="Enter Comment..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Button
          className="postBtn"
          disabled={!reply && isReplyPosting}
          onClick={addReplyHandler}
          sx={{ height: 45, width: 125 }}
        >
          {isReplyPosting ? "Posting..." : "Reply"}
        </Button>
      </Box>
    </Box>
  );
}

export default TopicReply;
