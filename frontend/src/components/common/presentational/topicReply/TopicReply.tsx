import { useEffect, useMemo, useState, useRef } from "react";

import { Avatar, Box, Button, Grid, Input, Skeleton } from "@mui/material";
import "@src/components/common/presentational/topicReply/topicReply.scss";
import moment from "moment";

import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { parseLink } from "@src/helpers/paging";
import { mobileWidth } from "@src/helpers/utils/config";
import { api, VfseCommentsRepliesCreateApiArg } from "@src/store/reducers/api";
import { Comment } from "@src/store/reducers/generated";

type TopicReplyProps = {
  commentData: Comment;
  replyChecked: boolean;
  scrollToTopReply?: () => void;
};

function TopicReply({
  commentData,
  replyChecked,
  scrollToTopReply,
}: TopicReplyProps) {
  const [browserWidth] = useWindowSize();
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
      if (totalReplyPages <= prev) {
        return 1;
      }
      return prev + 1;
    });
  };

  const totalReplyPages = useMemo(
    () => parseLink(repliesData?.link),
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

  const repliesContainerRef = useRef(null);
  const getRepliesHeight =
    repliesContainerRef?.current?.getBoundingClientRect();

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
        setPage(1);
        setReply("");
        setIsReplyPosting(false);
        if (
          reply &&
          (getRepliesHeight.y < 0 || getRepliesHeight.y > window?.innerHeight)
        ) {
          scrollToTopReply();
        }
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
    <Box className="TopicReplyView" ref={repliesContainerRef}>
      <div>
        {!isRepliesLoading ? (
          <div>
            {replies?.map((item, key) => (
              <>
                <div key={key} className="Comment" style={{ margin: "5px" }}>
                  <div className="profileImage">
                    <img src={item?.user_profile?.image} alt="profilePicture" />
                  </div>
                  <div
                    className="commentDetail"
                    style={
                      browserWidth < mobileWidth ? { marginTop: "10px" } : {}
                    }
                  >
                    <div className="headerInfo">
                      <p className="userName">{`${item?.user_profile?.name}`}</p>
                      <p className="timeStamp">
                        {moment(item?.created_at).startOf("s").fromNow()}
                      </p>
                    </div>
                    <div
                      className="commentDescription"
                      style={
                        browserWidth < mobileWidth ? { display: "none" } : {}
                      }
                    >
                      {item.comment}
                    </div>
                    <div className="commentActions"></div>
                  </div>
                </div>
                {browserWidth < mobileWidth ? (
                  <Grid xs={12} sm={12} marginLeft={5} marginBottom={1}>
                    <span style={{ wordBreak: "break-word" }}>
                      {item.comment}
                    </span>
                  </Grid>
                ) : (
                  ""
                )}
              </>
            ))}
            {totalReplyPages ? (
              <div
                className="Comment replyIconText"
                style={{ cursor: "pointer" }}
                onClick={handlePagination}
              >
                {totalReplyPages > page
                  ? "Show more replies"
                  : "Show less replies"}
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
          sx={{ height: 45, width: 125, display: { xs: "none", md: "flex" } }}
        >
          {isReplyPosting ? "Posting..." : "Reply"}
        </Button>
      </Box>
    </Box>
  );
}

export default TopicReply;
