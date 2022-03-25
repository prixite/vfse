import { Box, Button } from "@mui/material";

import "@src/components/common/presentational/topicUpdatesCards/topicUpdatesCard.scss";

interface TopicUpdatesCards {
  cardText: string;
  messageText: string;
  followerText: string;
  modality: string;
  messageImage: string;
  followerProfiles: string;
}

const TopicUpdatesCards = ({
  cardText,
  messageText,
  followerText,
  modality,
  messageImage,
  followerProfiles,
}: TopicUpdatesCards) => {
  return (
    <>
      <Box component="div" className="TopicUpdatesCard">
        <Box component="div" className="card_header">
          <div className="modalitytag">
            <p className="modality">{modality}</p>
          </div>
          <Button variant="contained" className="follow">
            <p className="text">Follow</p>
          </Button>
        </Box>
        <div className="card_detail">{cardText}</div>
        <Box component="div" className="card_footer">
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
        </Box>
      </Box>
    </>
  );
};

export default TopicUpdatesCards;
