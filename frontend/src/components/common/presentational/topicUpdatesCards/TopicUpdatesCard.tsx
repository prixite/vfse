import { Box, Button } from "@mui/material";

import "@src/components/common/presentational/topicUpdatesCards/topicUpdatesCard.scss";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";

interface TopicUpdatesCards {
  cardTitle: string;
  description: string;
  image: string;
  numberOfComments?: number;
  numberOfFollowers?: number;
  categories?: number[]; //Update TypeScript!
  // image?: string;
  // followers?: User2[],
}

const TopicUpdatesCards = ({
  cardTitle,
  numberOfComments,
  numberOfFollowers,
  categories,
  description,
}: // image,
// reply_email_notification,
// followers,
TopicUpdatesCards) => {
  return (
    <>
      <Box component="div" className="TopicUpdatesCard">
        <Box
          component="div"
          className="card_header"
          style={{ alignItems: "center" }}
        >
          {categories?.length ? (
            <div className="categoriesTags" style={{ marginTop: "0px" }}>
              {categories.map((category, index) => (
                <div className="tag" key={index}>
                  {category}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}

          <Button variant="contained" className="follow">
            <p className="text">Follow</p>
          </Button>
        </Box>
        <div className="card_detail">{cardTitle}</div>
        <div className="card_detail">{description}</div>
        <Box component="div" className="card_footer">
          <div className="profile_side">
            <div className="follower_img_container">
              <img src={followersIcon} className="imgStylingProfiles" />
            </div>
            <div className="followerText">{numberOfFollowers}</div>
          </div>
          <div className="message_side">
            <div className="message_text_container">
              <img className="imgStylingMessage" src={messageIcon} />
            </div>
            <div className="messageText">{numberOfComments} </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default TopicUpdatesCards;
