import { Box, Button } from "@mui/material";

import "@src/components/common/presentational/topicUpdatesCards/topicUpdatesCard.scss";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import { TopicCategory } from "@src/store/reducers/generated";

interface TopicUpdatesCards {
  cardTitle: string;
  numberOfComments?: number;
  numberOfFollowers?: number;
  categories?: TopicCategory[]; //Update TypeScript!
  // image?: string;
  // followers?: User2[],
}

const TopicUpdatesCards = ({
  cardTitle,
  numberOfComments,
  numberOfFollowers,
  categories,
}: TopicUpdatesCards) => {
  return (
    <>
      <Box component="div" className="TopicUpdatesCard">
        <Box
          component="div"
          className="card_header"
          style={{ alignItems: "center" }}
        >
          <div className="categoriesTags" style={{ marginTop: "0px" }}>
            {categories?.length ? (
              <>
                {categories?.map((category, index) => (
                  <div className="tag" key={index}>
                    {category?.name}
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>

          <Button variant="contained" className="follow">
            <p className="text">Follow</p>
          </Button>
        </Box>
        <div className="card_detail">{cardTitle}</div>
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
