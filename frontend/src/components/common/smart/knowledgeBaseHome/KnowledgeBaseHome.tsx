import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import NoDataFoundCard from "@src/components/shared/noDataFound/NoDataFoundCard";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import FolderModal from "@src/components/shared/popUps/folderModal/FolderModal";
import { api, Category, Document } from "@src/store/reducers/api";

import CategoryOptionsSection from "../categoryOptionsSection/categoryOptionsSection";
const KnowledgeBaseHome = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [categoryListForSearch, setCategoryListForSearch] = useState<
    Category[]
  >([]);
  const [articlesList, setArticlesList] = useState<Document[]>([]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [folderDataState, setFolderDataState] = useState({
    action: "edit",
    title: "",
    categoryName: "",
    id: null,
    folderCategoryIDS: [],
  });
  const [folderOpen, setFolderOpen] = useState(false);
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
  const handleFolderClose = () => {
    setFolderOpen(false);
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
  const handleEdit = (selectedArticle) => {
    setFolderOpen(true);
    setFolderDataState({
      title: selectedArticle.title,
      action: selectedArticle.text,
      id: selectedArticle.folderId,
      categoryName: selectedArticle.categoryName,
      folderCategoryIDS: selectedArticle.categories,
    });
  };

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
      <h2 className={classes.subHeading}>{t("Top Help Articles")}</h2>
      <Grid
        container
        spacing={{ xs: 2, sm: 1, md: 1, lg: 1, xl: 1 }}
        mt={3}
        className={classes.knowledgeBaseCardsContainer}
      >
        {articlesList.map((item, index) => (
          <Grid
            item={true}
            xs={12}
            sm={6}
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
            />
          </Grid>
        ))}
      </Grid>
      {categoryListForSearch?.map((category, index) => (
        <div key={index}>
          <div className={classes.seeAllDiv}>
            <h2 className={classes.subHeading}>{category?.name}</h2>
            <CategoryOptionsSection category={category} id={id} />
          </div>
          <Grid container spacing={2}>
            {category?.folders?.length ? (
              category?.folders?.map((item, index) => (
                <Grid item={true} xs={12} xl={3} md={6} lg={4} key={index}>
                  <ArticleCard
                    color={category?.color}
                    handleEdit={handleEdit}
                    title={item?.name}
                    articleNo={item?.document_count}
                    id={item.id}
                    categories={item?.categories}
                    categoryID={category?.id}
                    categoryName={category?.name}
                  />
                </Grid>
              ))
            ) : (
              <NoDataFoundCard
                message={t("Sorry, no folders found against this category.")}
              />
            )}
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
            title={t("Sorry! No results found. :(")}
            description={t("Try Again")}
          />
        )}
      <ArticleModal open={open} handleClose={handleClose} />
      <FolderModal
        open={folderOpen}
        handleClose={handleFolderClose}
        folderDataState={folderDataState}
      />
    </>
  );
};

export default KnowledgeBaseHome;
