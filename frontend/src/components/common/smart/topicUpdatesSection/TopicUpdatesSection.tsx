import { Box, Grid } from "@mui/material";

import "@src/components/common/smart/topicUpdatesSection/topicUpdatesSection.scss";
import TopicUpdatesCards from "@src/components/common/presentational/topicUpdatesCards/TopicUpdatesCard";
import { api } from "@src/store/reducers/api";

interface TopicUpdatesSection {
  title: string;
  seeAll: string;
}

const TopicUpdatesSection = ({ title, seeAll }: TopicUpdatesSection) => {
  const { data: popularTopicData = [] } = api.useGetPopularTopicsQuery();

  return (
    <>
      <Box component="div" className="topic_updates_section">
        <div className="heading_section">
          <h2 className="heading">{title}</h2>
          <h3 className="subheading">{seeAll}</h3>
        </div>
        <Box component="div" className="cardsSection">
          <Grid container spacing={3}>
            {popularTopicData.map((item, key) => (
              <Grid key={key} item lg={6} xl={3} md={4} sm={6} xs={12}>
                <TopicUpdatesCards
                  cardTitle={item?.title}
                  numberOfComments={item?.number_of_comments}
                  numberOfFollowers={item?.number_of_followers}
                  categories={item?.categories}
                  // image={item?.image}
                  // reply_email_notification={item?.reply_email_notification}
                  // followers={item?.followers}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TopicUpdatesSection;
