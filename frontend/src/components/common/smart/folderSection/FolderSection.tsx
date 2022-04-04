import { useState } from "react";

import { Grid, Box } from "@mui/material";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { Category } from "@src/store/reducers/generated";
import "@src/components/common/smart/folderSection/folderSection.scss";
interface FolderSetionProps {
  categoryData: Category;
}
const FolderSection = ({ categoryData }: FolderSetionProps) => {
  const [query, setQuery] = useState("");
  const { noDataTitle, noDataDescription } = localizedData().systems;

  return (
    <Box component="div" className="folder-heading">
      <TopViewBtns
        path="knowledge-base-folder"
        searchText={query}
        setSearchText={setQuery}
      />
      <Grid container spacing={1} style={{ marginTop: "30px" }}>
        {categoryData?.folders.length ? (
          categoryData?.folders?.map((item, index) => (
            <Grid item={true} xs={6} xl={3} md={3} key={index}>
              <ArticleCard
                color={categoryData?.color}
                title={item?.name}
                articleNo={item?.document_count}
                id={item.id}
              />
            </Grid>
          ))
        ) : (
          <NoDataFound
            search
            setQuery={setQuery}
            queryText={query}
            title={noDataTitle}
            description={noDataDescription}
          />
        )}
      </Grid>
    </Box>
  );
};

export default FolderSection;
