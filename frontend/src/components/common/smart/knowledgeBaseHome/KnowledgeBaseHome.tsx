import { useState } from "react";

import { Grid } from "@mui/material";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
const KnowledgeBaseHome = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { data: topData = [] } = api.useGetTopArticlesQuery();
  // eslint-disable-next-line
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();

  // eslint-disable-next-line
  const handleSearchQuery = (searchQuery: string) => {
    // will write handleSearch Logic here
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <TopViewBtns
        setOpen={setOpen}
        path="knowledge-base"
        setSearchText={setQuery}
        searchText={query}
      />
      <h2 className="sub-heading">Top Help Articles</h2>
      <Grid container spacing={1}>
        {topData.map((item, index) => (
          <Grid item={true} xs={6} xl={2} md={6} lg={3} key={index}>
            <KnowledgeTopCard title={item?.title} description={item?.text} />
          </Grid>
        ))}
      </Grid>
      {categoriesList?.map((category, index) => (
        <div key={index}>
          <h2 className="sub-heading">{category?.name}</h2>
          <Grid container spacing={2}>
            {category?.folders?.map((item, index) => (
              <Grid item={true} xs={12} xl={3} md={6} lg={4} key={index}>
                <ArticleCard
                  color={category?.color}
                  title={item?.name}
                  articleNo={item?.document_count}
                  id={item.id}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
      {!categoriesList?.length && query?.length > 2 ? (
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
      <ArticleModal open={open} handleClose={handleClose} />
    </>
  );
};

export default KnowledgeBaseHome;
