import { useState, useEffect } from "react";

import { Grid } from "@mui/material";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
const AllCategoriesSection = () => {
  const [folderList, setFolderList] = useState([]);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  const { noDataTitle, noDataDescription } = localizedData().systems;
  // eslint-disable-next-line
  const { data: categoriesList = [], isLoading: isCategoriesLoading } =
    api.useGetCategoriesQuery();
  // eslint-disable-next-line
  const handleSearchQuery = (searchQuery: string) => {
    // will write handleSearch Logic here
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
    </>
  );
};

export default AllCategoriesSection;
