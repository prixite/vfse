import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import TopicCard from "@src/components/common/presentational/topicCard/TopicCard";
import TopicCommentSection from "@src/components/common/smart/topicCommentSection/TopicCommentSection";
import { api } from "@src/store/reducers/api";
const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { data: topicData } = api.useGetTopicQuery({ id: topicId });
  return (
    <Box component="div" className="topicDetail">
      <BackBtn />
      <Grid container style={{ marginTop: "10px", justifyContent: "center" }}>
        <Grid item xs={9}>
          <TopicCard topic={topicData} />
        </Grid>
        <Grid item xs={9}>
          <TopicCommentSection />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopicDetail;
