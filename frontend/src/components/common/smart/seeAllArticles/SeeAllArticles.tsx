import { useState, useEffect } from "react";

import { Grid } from "@mui/material";

import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import { api } from "@src/store/reducers/api";
import { Document } from "@src/store/reducers/generated";
const SeeAllArticles = () => {
  const [articlesList, setArticlesList] = useState<Document[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: topData = [] } = api.useGetAllArticlesQuery();
  // eslint-disable-next-line

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
      <h2 className="sub-heading">All Articles</h2>
      <Grid container spacing={1}>
        {articlesList.map((item, index) => (
          <Grid item={true} xs={6} xl={2} md={6} lg={3} key={index}>
            <KnowledgeTopCard title={item?.title} description={item?.text} />
          </Grid>
        ))}
      </Grid>
      <ArticleModal open={open} handleClose={handleClose} />
    </>
  );
};

export default SeeAllArticles;
