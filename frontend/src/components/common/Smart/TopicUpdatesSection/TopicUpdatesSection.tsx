import { Box, Grid } from "@mui/material";

import "@src/components/common/Smart/TopicUpdatesSection/TopicUpdatesSection.scss";
import badgeIcon from "@src/assets/svgs/Badge.svg";
import buttonsIcon from "@src/assets/svgs/Buttons.svg";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import TopicUpdatesCards from "@src/components/common/Presentational/TopicUpdatesCards/TopicUpdatesCard";

const topic_info = [
  {
    card_text: "Clinical Specialist for MedTronics error in database...",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics  error in database...",
    followers_text: "24 followers",
    message_text: "142",
    device_number: "2,220",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics  error in database...",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
  {
    card_text: "Clinical Specialist for MedTronics error in database...",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
  },
];

const TopicUpdatesSection = () => {
  return (
    <Box component="div" className="topic_updates_section">
      <div className="heading_section">
        <h2 className="heading">Topic Updates</h2>
        <h3 className="subheading">See All</h3>
      </div>
      <div className="cardsSection">
        <Grid container spacing={3}>
          {topic_info.map((item, key) => (
            <Grid key={key} item xl={3} md={4} xs={12}>
              <TopicUpdatesCards
                key={item.message_text}
                cardText={item.card_text}
                messageText={item.message_text}
                followerText={item.followers_text}
                ultraImage={item.ultra_image}
                followerImage={item.follower_btn}
                messageImage={item.message_icon}
                followerProfiles={item.followers_icon}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
};

export default TopicUpdatesSection;
