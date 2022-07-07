import { useEffect, useMemo, useState } from "react";

import { Avatar, Box, Button, Input, Skeleton } from "@mui/material";
import "@src/components/common/presentational/topicReply/topicReply.scss";
import moment from "moment";

import { linkParser } from "@src/helpers";
import { api, VfseCommentsRepliesCreateApiArg } from "@src/store/reducers/api";
import { Comment } from "@src/store/reducers/generated";

type TopicReplyProps = {
  commentData: Comment;
  replyChecked: boolean;
};

function TopicReply({ commentData, replyChecked }: TopicReplyProps) {
  const [commentIDState, setCommentIDState] = useState<number>(commentData?.id);
  const [topicIDState, setTopicIDState] = useState<number>(commentData?.topic);
  const [page, setPage] = useState(1);
  const [replies, setRepliesData] = useState([]);
  //GET vfseCommentsRepliesCreate
  const {
    data: repliesData = { data: [], link: "" },
    isLoading: isRepliesLoading,
  } = api.useGetCommentsRepliesListQuery({
    id: commentIDState,
    topic: topicIDState,
    page,
  });

  const handlePagination = () => {
    setPage((prev) => {
      if (repliesPagination?.length === prev) {
        return 1;
      }
      return prev + 1;
    });
  };

  const repliesPagination = useMemo(
    () => linkParser(repliesData.link),
    [repliesData?.data]
  );
  //POST vfseCommentsRepliesCreate
  const [addReply] = api.useVfseCommentsRepliesCreateMutation();

  const [reply, setReply] = useState<string>("");
  const [isReplyPosting, setIsReplyPosting] = useState<boolean>(false);

  useEffect(() => {
    setCommentIDState(commentData?.id);
    setTopicIDState(commentData?.topic);
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

  const keyPressEnter = (event) => {
    if (event.key == "Enter") {
      addReplyHandler();
    }
  };

  useEffect(() => {
    if (repliesData?.data) {
      if (page !== 1) {
        setRepliesData((prev) => [...prev, ...repliesData.data]);
      } else {
        setRepliesData([...repliesData.data]);
      }
    }
  }, [repliesData?.data]);

  return (
    <Box className="TopicReplyView">
      <div>
        {!isRepliesLoading ? (
          <div>
            {replies?.map((item, key) => (
              <div key={key} className="Comment" style={{ margin: "5px" }}>
                <div className="profileImage">
                  <img src={item?.user_profile?.image} alt="profilePicture" />
                </div>
                <div className="commentDetail">
                  <div className="headerInfo">
                    <p className="userName">{`${item?.user_profile?.name}`}</p>
                    <p className="timeStamp">
                      {moment(item?.created_at).startOf("s").fromNow()}
                    </p>
                  </div>
                  <div className="commentDescription">{item.comment}</div>
                  <div className="commentActions"></div>
                </div>
              </div>
            ))}
            {repliesPagination?.length ? (
              <div
                className="Comment replyIconText"
                style={{ cursor: "pointer" }}
                onClick={handlePagination}
              >
                {repliesPagination?.length !== page
                  ? "Show more replies"
                  : "Show less replies"}{" "}
              </div>
            ) : (
              ""
            )}
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
          onKeyPress={keyPressEnter}
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
