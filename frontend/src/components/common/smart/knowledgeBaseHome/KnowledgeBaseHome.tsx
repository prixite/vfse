import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles.tsx";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import { api, Category, Document } from "@src/store/reducers/api";
const KnowledgeBaseHome = () => {
  const classes = useStyles();
  const [categoryListForSearch, setCategoryListForSearch] = useState<
    Category[]
  >([]);
  const [articlesList, setArticlesList] = useState<Document[]>([]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { knowledgeBase } = constantsData;
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { organizationRoute } = constants;
  const { id } = useParams<{ id?: string }>();
  //APIs
  const { data: topData = [] } = api.useGetTopArticlesQuery();
  // eslint-disable-next-line
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();

  // eslint-disable-next-line
  const handleSearchQuery = (searchQuery: string) => {
    // handleSearch Logic here
    const dataForSearchCategories = [
      ...categoriesList.filter((data) =>
        data?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    const dataForSearchArticles = [
      ...topData.filter((data) =>
        data?.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    setArticlesList(dataForSearchArticles);
    setCategoryListForSearch(dataForSearchCategories);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (query.length > 2) {
      handleSearchQuery(query);
    } else {
      setArticlesList(topData);
      setCategoryListForSearch(categoriesList);
    }
  }, [query, categoriesList, topData]);

  return (
    <>
      <TopViewBtns
        setOpen={setOpen}
        path="knowledge-base"
        setSearchText={setQuery}
        searchText={query}
        actualData={categoriesList || topData}
        setData={setCategoryListForSearch}
      />
      <h2 className={classes.subHeading} pt={5}>
        {knowledgeBase.subTitle}
      </h2>
      <Grid container spacing={1} mt={3}>
        {articlesList.map((item, index) => (
          <Grid item={true} xs={12} xl={2} md={6} lg={3} key={index}>
            <KnowledgeTopCard
              title={item?.title}
              description={item?.text}
              id={item?.id}
            />
          </Grid>
        ))}
      </Grid>
      {categoryListForSearch?.map((category, index) => (
        <div key={index}>
          <div className={classes.seeAllDiv}>
            <h2 className={classes.subHeading}>{category?.name}</h2>
            <Link
              className={classes.seeAll}
              to={`/${organizationRoute}/${id}/knowledge-base/category/${category?.id}`}
            >
              {knowledgeBase.seeAllFolders}
            </Link>
          </div>
          <Grid container spacing={2}>
            {category?.folders?.map((item, index) => (
              <Grid item={true} xs={12} xl={3} md={6} lg={4} key={index}>
                <ArticleCard
                  color={category?.color}
                  title={item?.name}
                  articleNo={item?.document_count}
                  id={item.id}
                  categoryID={category?.id}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
      {!categoryListForSearch?.length &&
        !articlesList.length &&
        query?.length > 2 && (
          <NoDataFound
            search
            setQuery={setQuery}
            queryText={query}
            title={noDataTitle}
            description={noDataDescription}
          />
        )}
      <ArticleModal open={open} handleClose={handleClose} />
    </>
  );
};

export default KnowledgeBaseHome;
