import { useState } from "react";

import { Box, Input, Button, Avatar, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";

import TopicComment from "@src/components/common/presentational/topicComment/TopicComment";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery, api } from "@src/store/reducers/api";
import { VfseTopicsCommentsCreateApiArg } from "@src/store/reducers/generated";
import "@src/components/common/smart/topicCommentSection/topicCommentSection.scss";
const TopicCommentSection = () => {
  const selectedOrganization = useSelectedOrganization();
  const { topicId } = useParams<{ topicId: string }>();
  //POST PostTopicComment
  const [addComment] = api.usePostTopicCommentMutation();
  //GET GetTopicsCommentsList
  const { data: commentsData = [], isLoading: isCommentsLoading } =
    api.useGetTopicsCommentsListQuery({ id: topicId });
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
  return (
    <Box className="topicCommentSection" component="div">
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
          sx={{ height: 45, width: 125 }}
        >
          {isCommentPosting ? "Posting..." : "Add reply"}
        </Button>
      </Box>
      {!isCommentsLoading ? (
        <>
          {commentsData.map((comment, key) => (
            <div key={key} style={{ width: "100%" }}>
              <TopicComment
                profile_picture={me?.profile_picture}
                first_name={me?.first_name}
                last_name={me?.last_name}
                commentData={comment}
              />
            </div>
          ))}
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
