import { useState, useEffect } from "react";

import { Grid } from "@mui/material";

import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles.tsx";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import { api } from "@src/store/reducers/api";
import { Document } from "@src/store/reducers/generated";

const SeeAllArticles = () => {
  const classes = useStyles();
  const [articlesList, setArticlesList] = useState<Document[]>([]);
  const [query, setQuery] = useState("");
  const { article } = constantsData;
  const [open, setOpen] = useState(false);
  const [showNoDataFound, setShowNoDataFound] = useState<boolean>(false);
  const { data: topData = [] } = api.useGetAllArticlesQuery();
  // eslint-disable-next-line
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const handleSearchQuery = (searchQuery: string) => {
    // logic to search article from searchBar
    const dataForSearch = [
      ...topData.filter((data) =>
        data?.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    setArticlesList(dataForSearch);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (query.length > 2) {
      handleSearchQuery(query);
    } else {
      setArticlesList(topData);
    }
  }, [query, topData]);

  useEffect(() => {
    articlesList.length === 0 &&
      setTimeout(() => {
        setShowNoDataFound(true);
      }, 1000);

    return () => {
      setShowNoDataFound(false);
    };
  }, []);
  return (
    <>
      <TopViewBtns
        setOpen={setOpen}
        path="knowledge-base"
        setSearchText={setQuery}
        searchText={query}
        setData={setArticlesList}
        actualData={topData}
      />
      <h2 className={classes.subHeading}>{article.allArticles}</h2>
      {articlesList.length ? (
        <Grid container spacing={1}>
          {articlesList.map((item, index) => (
            <Grid
              item={true}
              xs={12}
              sm={4}
              md={4}
              lg={3}
              xl={2}
              key={index}
              className={classes.knowledgeTopCard}
            >
              <KnowledgeTopCard
                title={item?.title}
                description={item?.text}
                id={item?.id}
                favourite={item?.favorite}
                path="see-all"
                article={item}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {showNoDataFound && (
            <NoDataFound
              search
              setQuery={setQuery}
              queryText={query}
              title={noDataTitle}
              description={noDataDescription}
            />
          )}
        </>
      )}
      <ArticleModal open={open} handleClose={handleClose} />
    </>
  );
};

export default SeeAllArticles;
