import { useMemo, useState, useEffect } from "react";

import { Box, Input, Button, Avatar, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";

import TopicComment from "@src/components/common/presentational/topicComment/TopicComment";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { parseLink } from "@src/helpers/paging";
import { mobileWidth } from "@src/helpers/utils/config";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery, api } from "@src/store/reducers/api";
import {
  VfseTopicsCommentsCreateApiArg,
  VfseTopicsCommentsListApiResponse,
} from "@src/store/reducers/generated";
import "@src/components/common/smart/topicCommentSection/topicCommentSection.scss";

const TopicCommentSection = () => {
  const [browserWidth] = useWindowSize();
  const selectedOrganization = useSelectedOrganization();
  const { topicId } = useParams<{ topicId: string }>();
  const [page, setPage] = useState(1);
  const [comments, setCommentsData] =
    useState<VfseTopicsCommentsListApiResponse>([]);
  //POST PostTopicComment
  const [addComment] = api.usePostTopicCommentMutation();
  //GET GetTopicsCommentsList
  const {
    data: commentsData = { data: [], link: "" },
    isLoading: isCommentsLoading,
  } = api.useGetTopicsCommentsListQuery({ id: topicId, page });
  const [comment, setComment] = useState("");
  const [isCommentPosting, setIsCommentPosting] = useState(false);
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );

  const handlePagination = () => {
    setPage((prev) => {
      if (totalPages <= prev) {
        return 1;
      }
      return prev + 1;
    });
  };

  const totalPages = useMemo(
    () => parseLink(commentsData?.link),
    [commentsData.data]
  );

  const addCommentHandler = () => {
    const payload: VfseTopicsCommentsCreateApiArg = {
      id: topicId,
      comment: { user: me?.id, comment: comment },
    };
    setIsCommentPosting(true);
    addComment(payload)
      .unwrap()
      .finally(() => {
        setComment("");
        setIsCommentPosting(false);
      });
  };

  const keyPressEnter = (event) => {
    if (event.key == "Enter") {
      addCommentHandler();
    }
  };

  useEffect(() => {
    if (page !== 1) {
      setCommentsData((prev) => [...prev, ...commentsData.data]);
    } else {
      setCommentsData([...commentsData.data]);
    }
  }, [commentsData.data]);

  return (
    <Box
      className="topicCommentSection"
      component="div"
      style={
        browserWidth < mobileWidth
          ? {
              boxShadow: "3px 3px 12px rgb(10 35 83 / 8%)",
              backgroundColor: "white",
              padding: "16px",
            }
          : {}
      }
    >
      {!me?.view_only ? (
        <Box component="div" className="commentActions">
          <div className="profileImage">
            <img src={me?.profile_picture} alt="profilePicture" />
          </div>
          <Input
            className="commentInput"
            placeholder="Enter Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={keyPressEnter}
          />
          <Button
            className="postBtn"
            disabled={!comment && isCommentPosting}
            onClick={addCommentHandler}
            sx={{
              height: 45,
              width: 125,
              display: { xs: "none", sm: "none", md: "flex" },
            }}
          >
            {isCommentPosting ? "Posting..." : "Add Reply"}
          </Button>
        </Box>
      ) : (
        ""
      )}
      {!isCommentsLoading ? (
        <>
          {comments.map((comment) => (
            <div key={comment.id} style={{ width: "100%" }}>
              <TopicComment commentData={comment} />
            </div>
          ))}
          {totalPages ? (
            <div
              className="replyIconText"
              style={{ cursor: "pointer", margin: "5px" }}
              onClick={handlePagination}
            >
              {totalPages > page ? "Show more comments" : "Show less comments"}{" "}
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <Box component="div" style={{ width: "100%", marginTop: "16px" }}>
          <Box
            component="div"
            style={{ width: "100%", display: "flex", alignItems: "center" }}
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
    </Box>
  );
};

export default TopicCommentSection;
