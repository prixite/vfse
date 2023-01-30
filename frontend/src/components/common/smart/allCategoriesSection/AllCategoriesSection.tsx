import { useState, useEffect } from "react";

import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import NoDataFoundCard from "@src/components/shared/noDataFound/NoDataFoundCard";
import CategoryModal from "@src/components/shared/popUps/categoryModal/CategoryModal";
import FolderModal from "@src/components/shared/popUps/folderModal/FolderModal";
import { localizedData } from "@src/helpers/utils/language";
import { api, Category } from "@src/store/reducers/api";

import CategoryOptionsSection from "../categoryOptionsSection/categoryOptionsSection";

const AllCategoriesSection = () => {
  const classes = useStyles();
  const [folderList, setFolderList] = useState<Category[]>([]);
  const [folderDataState, setFolderDataState] = useState({
    action: "edit",
    title: "",
    categoryName: "",
    id: null,
    folderCategoryIDS: [],
  });
  const [query, setQuery] = useState("");
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const { id } = useParams<{ id?: string }>();
  const handleClose = () => {
    setOpen(false);
  };
  const handleFolderClose = () => {
    setFolderOpen(false);
  };
  const { noDataTitle, noDataDescription } = localizedData().systems;
  const { Message } = localizedData().allCategoriesSection;
  // eslint-disable-next-line
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();
  // eslint-disable-next-line

  const handleSearchQuery = (searchQuery: string) => {
    // handleSearch Logic here
    const dataForSearch = [
      ...categoriesList.filter((data) =>
        data?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    ];
    setFolderList(dataForSearch);
  };
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
  useEffect(() => {
    if (query.length > 2) {
      handleSearchQuery(query);
    } else {
      setFolderList(categoriesList);
    }
  }, [query, categoriesList]);
  return (
    <>
      <TopViewBtns
        setOpen={setOpen}
        path="knowledge-base-category"
        setSearchText={setQuery}
        searchText={query}
        setData={setFolderList}
        actualData={categoriesList}
      />
      {folderList?.map((category, index) => (
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
                    title={item?.name}
                    articleNo={item?.document_count}
                    handleEdit={handleEdit}
                    id={item.id}
                    categories={item?.categories}
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
      {!folderList?.length && query?.length > 2 && (
        <NoDataFound
          search
          setQuery={setQuery}
          queryText={query}
          title={noDataTitle}
          description={noDataDescription}
        />
      )}
      <CategoryModal open={open} handleClose={handleClose} />
      <FolderModal
        open={folderOpen}
        handleClose={handleFolderClose}
        folderDataState={folderDataState}
      />
    </>
  );
};

export default AllCategoriesSection;
