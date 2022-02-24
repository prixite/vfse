import { Box } from "@mui/material";

import "@src/components/common/Presentational/TopicUpdatesCards/TopicUpdatesCard.scss";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";

interface TopicUpdatesCards {
  cardText: string;
  messageText: string;
  followerText: string;
  ultraImage: string;
  followerImage: string;
  messageImage: string;
  followerProfiles: string;
}

const TopicUpdatesCards = ({
  cardText,
  messageText,
  followerText,
  ultraImage,
  followerImage,
  messageImage,
  followerProfiles,
}: TopicUpdatesCards) => {
  const [browserWidth] = useWindowSize();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <div className="topicInfo">
          <Box component="div" className="card">
            <div className="card_header">
            <div className="topic_updates_imags">
              <img src={ultraImage} className="imgStyling" />
              </div>
              <div className="topic_updates_imags">
              <img src={followerImage} className="imgStyling" />
              </div>
            </div>
            <div className="card_detail">{cardText}</div>
            <div className="card_footer">
              <div className="profile_side">
                <div className="follower_img_container">
                  <img src={followerProfiles} className="imgStylingProfiles" />
                </div>
                <div className="followerText">{followerText}</div>
              </div>
              <div className="message_side">
                <div className="message_text_container">
                  <img src={messageImage} className="imgStylingMessage" />
                </div>
                <div className="messageText">{messageText}</div>
              </div>
            </div>
          </Box>
        </div>
      ) : (
        <div className="mobiletopicInfo">
          <Box component="div" className="card">
            <div className="card_header">
              <div className="topic_updates_imags">
              <img src={ultraImage} className="imgStyling" />
              </div>
              <div className="topic_updates_imags">
              <img src={followerImage} className="imgStyling" />
              </div>
            </div>
            <div className="card_detail">{cardText}</div>
            <div className="card_footer">
              <div className="profile_side">
                <div className="follower_img_container">
                  <img src={followerProfiles} className="imgStylingProfiles" />
                </div>
                <div className="followerText">{followerText}</div>
              </div>
              <div className="message_side">
                <div className="message_text_container">
                  <img src={messageImage} className="imgStylingMessage" />
                </div>
                <div className="messageText">{messageText}</div>
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default TopicUpdatesCards;
