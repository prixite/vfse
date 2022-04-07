import { useState, useEffect } from "react";

import { Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import CategoryModal from "@src/components/shared/popUps/categoryModal/CategoryModal";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { api, Category } from "@src/store/reducers/api";

const AllCategoriesSection = () => {
  const [folderList, setFolderList] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  const { organizationRoute } = constants;
  const { id } = useParams<{ id?: string }>();
  const handleClose = () => {
    setOpen(false);
  };
  const { noDataTitle, noDataDescription } = localizedData().systems;
  // eslint-disable-next-line
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();
  // eslint-disable-next-line

  const handleSearchQuery = (searchQuery: string) => {
    // handleSearch Logic here
    const dataForSearch = [
      ...categoriesList.filter((data) =>
        data?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    setFolderList(dataForSearch);
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="sub-heading">{category?.name}</h2>
            <Link
              className="see-all"
              to={`/${organizationRoute}/${id}/knowledge-base/category/${category?.id}`}
            >
              See All Folders
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
      {!folderList?.length && query?.length > 2 ? (
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
      {/* <CategoryModal open={open} handleClose={handleClose} /> */}
      <CategoryModal open={open} handleClose={handleClose} />
    </>
  );
};

export default AllCategoriesSection;
