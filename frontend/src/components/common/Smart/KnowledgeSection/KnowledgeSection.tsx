import { Grid, Box } from "@mui/material";

import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";

import ArticleCard from "../../Presentational/ArticleCard/ArticleCard";
import "@src/components/common/Smart/KnowledgeSection/KnowledgeSection.scss";

const topData = [
  {
    color: "#28D4AB",
    number: 1,
  },
  {
    color: "#28D4AB",
    number: 2,
  },
  {
    color: "#28D4AB",
    number: 3,
  },
  {
    color: "#28D4AB",
    number: 4,
  },
];

const articleData = [
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
];

const KnowledgeSection = () => {
  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">Knowledge base</h1>
      <TopViewBtns path="documentation" />
      <h2 className="sub-heading">Top Help Articles</h2>
      <Grid container spacing={1}>
        {articleData.map((item, index) => (
          <Grid item={true} xs={2} key={index}>
            <KnowledgeTopCard title={item?.title} />
          </Grid>
        ))}
      </Grid>
      <h2 className="sub-heading">Category one</h2>
      <Grid container spacing={2}>
        {topData.map((item, index) => (
          <Grid item={true} xs={3} key={index} style={{ marginTop: "12px" }}>
            <ArticleCard color={item?.color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KnowledgeSection;
