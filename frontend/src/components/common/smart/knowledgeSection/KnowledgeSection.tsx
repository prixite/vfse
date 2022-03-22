import { useEffect, useState } from "react";

import Flicking from "@egjs/react-flicking";
import { Grid, Box } from "@mui/material";
import { isMobileOnly } from "react-device-detect";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/smart/knowledgeSection/knowledgeSection.scss";

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
        title: "category",
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
        title: "category",
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
  const [folderList, setFolderList] = useState([]);
  const [query, setQuery] = useState("");
  const constantData: LocalizationInterface = localizedData();
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { title, subTitle } = constantData.knowledgeBase;

  const handleSearchQuery = (searchQuery: string) => {
    const actualData = articleData
      .map((item) => {
        return {
          title: item?.title,
          categories: item?.categories?.filter(
            (subItem) =>
              subItem?.title?.toLocaleLowerCase()?.search(searchQuery) != -1
          ),
        };
      })
      .filter((item) => item?.categories?.length);
    setFolderList(actualData);
  };

  useEffect(() => {
    if (query.length > 2) {
      handleSearchQuery(query);
    } else {
      setFolderList(articleData);
    }
  }, [query, articleData]);

  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">{title}</h1>
      <TopViewBtns
        path="documentation"
        setSearchText={setQuery}
        searchText={query}
        setData={setFolderList}
        actualData={articleData}
      />
      <h2 className="sub-heading">{subTitle}</h2>
      {browserWidth < mobileWidth && browserWidth !== 0 ? (
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
      {folderList?.map((item, index) => (
        <div key={index}>
          <h2 className="sub-heading">{item?.title}</h2>
          <Grid container spacing={2}>
            {item?.categories?.map((item, index) => (
              <Grid
                item={true}
                xs={isMobileOnly ? 12 : 6}
                xl={3}
                md={6}
                lg={4}
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
      {!folderList.length && query?.length > 2 ? (
        <NoDataFound
          search
          setQuery={setQuery}
          queryText={query}
          title={noDataTitle}
          description={noDataDescription}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default KnowledgeSection;
