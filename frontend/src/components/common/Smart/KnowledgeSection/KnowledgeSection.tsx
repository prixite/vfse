import Flicking from "@egjs/react-flicking";
import { Grid, Box } from "@mui/material";
import { isMobileOnly } from "react-device-detect";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import { mobileWidth } from "@src/helpers/utils/config";
import ArticleCard from "../../Presentational/ArticleCard/ArticleCard";

import "@src/components/common/Smart/KnowledgeSection/KnowledgeSection.scss";

const topData = [
  {
    title: "Get started",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
  },
  {
    title: "Get started",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
  },
  {
    title: "Get started",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
  },
];

const articleData = [
  {
    title: "Category 1",
    categories: [
      {
        id: 1,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 2,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 3,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 4,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
    ],
  },
  {
    title: "Get started",
    categories: [
      {
        id: 5,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 6,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 7,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
    ],
  },
  {
    title: "Get started",
    categories: [
      {
        id: 8,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 9,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
      {
        id: 10,
        title: "Get Started",
        color: "#28D4AB",
        number: 4,
      },
    ],
  },
];

const renderMobileCarousel = () => {
  return (
    <Flicking defaultIndex={0} deceleration={0.0075} horizontal bound gap={40}>
      {topData.map((item, index) => (
        <span key={index}>
          <KnowledgeTopCard
            title={item?.title}
            description={item?.description}
          />
        </span>
      ))}
    </Flicking>
  );
};

const KnowledgeSection = () => {
  const [browserWidth] = useWindowSize();
  const constantData: LocalizationInterface = localizedData();
  const { title, subTitle } = constantData.knowledgeBase;
  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">{title}</h1>
      <TopViewBtns path="documentation" />
      <h2 className="sub-heading">{subTitle}</h2>
      {browserWidth <= mobileWidth? (
        renderMobileCarousel()
      ) : (
        <Grid container spacing={1}>
          {topData.map((item, index) => (
            <Grid item={true} xs={6} xl={2} md={6} lg={3} key={index}>
              <KnowledgeTopCard
                title={item?.title}
                description={item?.description}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {articleData?.map((item, index) => (
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
                <ArticleCard
                  color={item?.color}
                  title={item?.title}
                  articleNo={item?.number}
                  id={item.id}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Box>
  );
};

export default KnowledgeSection;
