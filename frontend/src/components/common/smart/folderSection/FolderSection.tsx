import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";

import ArticleCard from "@src/components/common/presentational/articleCard/ArticleCard";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import FolderModal from "@src/components/shared/popUps/folderModal/FolderModal";
import "@src/components/common/smart/folderSection/folderSection.scss";
import { localizedData } from "@src/helpers/utils/language";
import { Category, Folder } from "@src/store/reducers/generated";
interface FolderSetionProps {
  categoryData?: Category;
}
const FolderSection = ({ categoryData }: FolderSetionProps) => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [action, setAction] = useState("add");
  const [title, setTitle] = useState("");
  const [id, setId] = useState(null);
  const { Message } = localizedData().allCategoriesSection;
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setAction("add");
  };

  const { noDataTitle, noDataDescription } = localizedData().systems;

  const handleSearchQuery = (searchQuery: string) => {
    const dataForSearch = [
      ...categoryData.folders.filter((data) =>
        data?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];
    setFolderList(dataForSearch);
  };
  useEffect(() => {
    if (query.length > 2) {
      handleSearchQuery(query);
    } else {
      setFolderList(categoryData?.folders);
    }
  }, [query, categoryData]);
  const handleEdit = (selectedArticle) => {
    setOpen(true);
    setAction(selectedArticle.text);
    setTitle(selectedArticle.title);
    setId(selectedArticle.folderId);
  };
  return (
    <>
      <Box component="div" className="folder-heading">
        <TopViewBtns
          setOpen={setOpen}
          path="knowledge-base-folder"
          searchText={query}
          setSearchText={setQuery}
          actualData={categoryData?.folders}
          setData={setFolderList}
        />
        <Grid container spacing={1} style={{ marginTop: "21px" }}>
          {folderList?.length ? (
            folderList?.map((item, index) => (
              <Grid item={true} xs={6} xl={3} md={4} key={index}>
                <ArticleCard
                  color={categoryData?.color}
                  title={item?.name}
                  articleNo={item?.document_count}
                  handleEdit={handleEdit}
                  id={item.id}
                  categoryID={categoryData.id}
                />
              </Grid>
            ))
          ) : (
            <NoDataFound title={Message} />
          )}

          {!folderList?.length && query?.length > 2 && (
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
        action={action}
        title={title}
        id={id}
      />
    </>
  );
};

export default FolderSection;
