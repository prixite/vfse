import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import KnowledgeTopCard from "@src/components/common/presentational/knowledgeTopCard/KnowledgeTopCard";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import NoDataFoundCard from "@src/components/shared/noDataFound/NoDataFoundCard";
import ArticleModal from "@src/components/shared/popUps/articleModal/ArticleModal";
import FolderModal from "@src/components/shared/popUps/folderModal/FolderModal";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import { api, Category, Document } from "@src/store/reducers/api";

import CategoryOptionsSection from "../categoryOptionsSection/categoryOptionsSection";
const KnowledgeBaseHome = () => {
  const classes = useStyles();
  const [categoryListForSearch, setCategoryListForSearch] = useState<
    Category[]
  >([]);
  const [articlesList, setArticlesList] = useState<Document[]>([]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dataState, setDataState] = useState({
    action: "edit",
    title: "",
    categoryName: "",
    id: null,
    categoryID: null,
  });
  const [folderOpen, setFolderOpen] = useState(false);
  const { knowledgeBase } = constantsData;
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { Message } = localizedData().allCategoriesSection;
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
    setDataState({
      title: selectedArticle.title,
      action: selectedArticle.text,
      id: selectedArticle.folderId,
      categoryName: selectedArticle.categoryName,
      categoryID: selectedArticle.categoryId,
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
      <h2 className={classes.subHeading}>{knowledgeBase.subTitle}</h2>
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
                    categoryID={category?.id}
                    categoryName={category?.name}
                  />
                </Grid>
              ))
            ) : (
              <NoDataFoundCard message={Message} />
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
            title={noDataTitle}
            description={noDataDescription}
          />
        )}
      <ArticleModal open={open} handleClose={handleClose} />
      <FolderModal
        open={folderOpen}
        handleClose={handleFolderClose}
        dataState={dataState}
      />
    </>
  );
};

export default KnowledgeBaseHome;
