import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import TopicCard from "@src/components/common/presentational/topicCard/TopicCard";
import TopicCommentSection from "@src/components/common/smart/topicCommentSection/TopicCommentSection";
import useStyles from "@src/components/common/smart/topicDetail/Styles";
import { api } from "@src/store/reducers/api";

import RecentActivity from "../../presentational/recentActivity/RecentActivity";
const TopicDetail = () => {
  const classes = useStyles();
  const { topicId } = useParams<{ topicId: string }>();
  const { data: topicData } = api.useGetTopicQuery({ id: topicId });
  return (
    <Box component="div" className="topicDetail">
      <BackBtn />
      <Grid container spacing={2} className={classes.mainGrid}>
        <Grid item xs={8} sm={8} md={8} lg={9} className={classes.TimeLine}>
          <Grid container xs={12} item style={{ marginTop: "0px" }}>
            <Grid item xs={12}>
              <TopicCard topic={topicData} />
            </Grid>
            <Grid item xs={12}>
              <TopicCommentSection />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={3}
          className={classes.recentActivity}
          style={{ paddingTop: "inherit" }}
        >
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopicDetail;
