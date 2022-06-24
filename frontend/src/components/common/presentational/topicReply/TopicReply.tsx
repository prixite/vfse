import { useEffect, useState } from "react";

import { Avatar, Box, Button, Input, Skeleton } from "@mui/material";

import "@src/components/common/presentational/topicReply/topicReply.scss";
import { api, VfseCommentsRepliesCreateApiArg } from "@src/store/reducers/api";
import { Comment } from "@src/store/reducers/generated";

type TopicReplyProps = {
  profile_picture: string;
  commentData: Comment;
  replyChecked: boolean;
};

function TopicReply({
  profile_picture, //!TODO
  commentData,
  replyChecked,
}: TopicReplyProps) {
  const [commentIDState, setCommentIDState] = useState<number>(commentData?.id);
  const [topicIDState, setTopicIDState] = useState<number>(commentData?.topic);
  // const [userIDState, setUserIDState] = useState<number>(commentData?.user);

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
    // setUserIDState(commentData?.user);
  }, [replyChecked, commentData]);

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
      <Box component="div" className="commentActions">
        <div className="profileImage">
          <img src={profile_picture} alt="profilePicture" />
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
      {/* Replied end  */}
      <div>
        {!isRepliesLoading ? (
          <div>
            {repliesData.map((item, key) => (
              <div key={key} className="Comment" style={{ margin: "5px" }}>
                <div className="profileImage">
                  <img src={profile_picture} alt="profilePicture" />
                </div>
                <div className="commentDetail">
                  <div className="headerInfo">
                    {/* <p className="userName">{`${first_name} ${last_name}`}</p> */}
                    <p className="userName">{`Comment-${++key}`}</p>
                    {/* <p className="timeStamp">{moment().startOf("minutes").fromNow()}</p> */}
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
    </Box>
  );
}

export default TopicReply;
