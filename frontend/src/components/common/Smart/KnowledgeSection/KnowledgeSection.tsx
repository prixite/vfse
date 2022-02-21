import Flicking from "@egjs/react-flicking";
import { Grid, Box } from "@mui/material";
import { isMobileOnly } from "react-device-detect";

import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";

import ArticleCard from "../../Presentational/ArticleCard/ArticleCard";
import "@src/components/common/Smart/KnowledgeSection/KnowledgeSection.scss";

const topData = [
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  }
];

const articleData = [
  {
    title: "Category 1",
    categories: [
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      }
    ]
  },
  {
    title: "Get started",
    categories: [
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      }
    ]
  },
  {
    title: "Get started",
    categories: [
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      },
      {
        title: 'Get Started',
        color: "#28D4AB",
        number: 4,
      }
    ]
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
          {topData.map((item, index) => (
            <Grid item={true} xs={6} xl={2} md={3} key={index}>
              <KnowledgeTopCard title={item?.title} />
            </Grid>
          ))}
        </Grid>
      )}
      {
        articleData?.map((item, index) => (
      <div key={index}>
        <h2 className="sub-heading">{item?.title}</h2>
        <Grid container spacing={2}>
          {item?.categories?.map((item, index) => (
            <Grid
              item={true}
              xs={isMobileOnly ? 12 : 6}
              xl={3}
              md={4}
              key={index}
            >
              <ArticleCard color={item?.color} title={item?.title} folderNo={item?.number}/>
            </Grid>
          ))}
        </Grid>
      </div>
        ))
     }
    </Box>
  );
};

export default KnowledgeSection;
