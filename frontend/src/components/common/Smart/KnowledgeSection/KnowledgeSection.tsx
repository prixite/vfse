import Flicking from "@egjs/react-flicking";
import { Grid, Box } from "@mui/material";
import { isMobileOnly } from "react-device-detect";

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

const renderMobileCarousel = () => {
  return (
    <Flicking defaultIndex={0} deceleration={0.0075} horizontal bound gap={40}>
      {articleData.map((item, index) => (
        <span key={index}>
          <KnowledgeTopCard title={item?.title} />
        </span>
      ))}
    </Flicking>
  );
};

const KnowledgeSection = () => {
  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">Knowledge base</h1>
      <TopViewBtns path="documentation" />
      <h2 className="sub-heading">Top Help Articles</h2>
      {isMobileOnly ? (
        renderMobileCarousel()
      ) : (
        <Grid container spacing={1}>
          {articleData.map((item, index) => (
            <Grid item={true} xs={6} xl={2} md={3} key={index}>
              <KnowledgeTopCard title={item?.title} />
            </Grid>
          ))}
        </Grid>
      )}
      <h2 className="sub-heading">Category one</h2>
      <Grid container spacing={2}>
        {topData.map((item, index) => (
          <Grid
            item={true}
            xs={isMobileOnly ? 12 : 6}
            xl={3}
            md={4}
            key={index}
          >
            <ArticleCard color={item?.color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KnowledgeSection;
