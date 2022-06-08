import { Box } from "@mui/material";
import moment from "moment";

import messageIcon from "@src/assets/svgs/message.svg";
import "@src/components/common/presentational/topicCard/topicCard.scss";
import { TopicDetail } from "@src/store/reducers/generated";

interface TopicCardProps {
  topic: TopicDetail;
}
const TopicCard = ({ topic }: TopicCardProps) => {
  return (
    <Box component="div" className="topicCard">
      <>
        <div className="timelineInfo">
          <div className="timelineCards">
            <Box component="div" className="card">
              <div className="card_header">
                <div className="userInfoWrapper">
                  <div className="topic_updates_imags">
                    <div className="imgStyling">
                      <img
                        src={topic?.user?.image}
                        alt="profile picture"
                        className="profilePic"
                      />
                    </div>
                  </div>
                  <div className="user_info">
                    <div className="userName">{topic?.user?.name}</div>
                    <div className="postTime">
                      {moment(topic?.created_at).startOf("minutes").fromNow()}
                    </div>
                  </div>
                </div>
              </div>
              {topic.categories?.length ? (
                <div className="categoriesTags">
                  {topic.categories.map((category, index) => (
                    <div className="tag" key={index}>
                      {category?.name}
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
              <div className="card_title">{topic.title}</div>
              <div className="card_detail">{topic.description}</div>
              {topic?.image ? (
                <div className="card_image">
                  <img src={topic.image} className="postImage" />
                </div>
              ) : (
                ""
              )}
              <div className="card_footer">
                <div className="profile_side">
                  <div className="followerText">{`${topic.number_of_followers} followers`}</div>
                </div>
                <div className="message_side">
                  <div className="message_text_container">
                    <img src={messageIcon} className="imgStylingMessage" />
                  </div>
                  <div className="messageText">{topic.number_of_comments}</div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </>
    </Box>
  );
};

export default TopicCard;
