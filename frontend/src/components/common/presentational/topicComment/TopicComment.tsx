import { Box } from "@mui/material";

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
  return (
    <Box component="div" className="TopicCommentView">
      <div className="Comment">
        <div className="profileImage">
          <img src={profile_picture} alt="profilePicture" />
        </div>
        <div className="commentDetail">
          <div className="headerInfo">
            <p className="userName">{`${first_name} ${last_name}`}</p>
            <p className="timeStamp">3 hours ago</p>
          </div>
          <div className="commentDescription">{commentData.comment}</div>
          <div className="commentActions">
            <div className="action">
              <img src={messageIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">Reply</span>
            </div>
            <div className="action">
              <img src={shareIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">Share</span>
            </div>
            <div className="action">
              <img src={reportIcon} alt="msgIcon" className="icon" />
              <span className="actionDescription">Report</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default TopicComment;
