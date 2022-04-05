import { useState } from "react";

import { Grid, Box } from "@mui/material";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import FolderModal from "@src/components/shared/popUps/folderModal/FolderModal";
import "@src/components/common/smart/folderSection/folderSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { Category } from "@src/store/reducers/generated";
interface FolderSetionProps {
  categoryData?: Category;
}
const FolderSection = ({ categoryData }: FolderSetionProps) => {
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const { noDataTitle, noDataDescription } = localizedData().systems;

  return (
    <>
      <Box component="div" className="folder-heading">
        <TopViewBtns
          setOpen={setOpen}
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
      <FolderModal
        open={open}
        handleClose={handleClose}
        categoryData={categoryData}
      />
    </>
  );
};

export default FolderSection;
