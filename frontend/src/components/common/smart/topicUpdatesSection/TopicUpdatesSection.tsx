import { Box, Grid } from "@mui/material";

import "@src/components/common/smart/topicUpdatesSection/topicUpdatesSection.scss";
import buttonsIcon from "@src/assets/svgs/buttons.svg";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import TopicUpdatesCards from "@src/components/common/presentational/topicUpdatesCards/TopicUpdatesCard";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";

interface TopicUpdatesSection {
  title: string;
  seeAll: string;
}
const topic_info = [
  {
    card_text: "Clinical Specialist for MedTronics error in database...",
    followers_text: "24 followers",
    message_text: "142",
    modality: "ULTRASOUND",
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics  error in database...",
    followers_text: "24 followers",
    message_text: "142",
    device_number: "2,220",
    modality: "MRI",
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics  error in database...",
    followers_text: "24 followers",
    message_text: "142",
    modality: "MRI",
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics error in database...",
    followers_text: "24 followers",
    message_text: "142",
    modality: "MRI",
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
];

const TopicUpdatesSection = ({ title, seeAll }: TopicUpdatesSection) => {
  const [browserWidth] = useWindowSize();
  return (
    <>
      <Box component="div" className="topic_updates_section">
        <div className="heading_section">
          <h2 className="heading">{title}</h2>
          <h3 className="subheading">{seeAll}</h3>
        </div>
        {browserWidth > mobileWidth ? (
          <Box component="div" className="cardsSection">
            <Grid container spacing={3}>
              {topic_info.map((item, key) => (
                <Grid key={key} item lg={6} xl={3} md={4} sm={6} xs={12}>
                  <TopicUpdatesCards
                    key={item.message_text}
                    cardText={item.card_text}
                    messageText={item.message_text}
                    modality={item.modality}
                    followerText={item.followers_text}
                    messageImage={item.message_icon}
                    followerProfiles={item.followers_icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box component="div" className="mobilecardsSection">
            {topic_info.map((item, key) => (
              <div key={key}>
                <TopicUpdatesCards
                  key={item.message_text}
                  cardText={item.card_text}
                  messageText={item.message_text}
                  modality={item.modality}
                  followerText={item.followers_text}
                  messageImage={item.message_icon}
                  followerProfiles={item.followers_icon}
                />
              </div>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default TopicUpdatesSection;
