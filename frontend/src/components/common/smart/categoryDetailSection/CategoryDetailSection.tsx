import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

import BackBtn from "@src/components/common/presentational/backBtn/BackBtn";
import FolderSection from "@src/components/common/smart/folderSection/FolderSection";
import { api } from "@src/store/reducers/api";
import "@src/components/common/smart/categoryDetailSection/categoryDetailSection.scss";
const CategoryDetailSection = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categoryData } = api.useGetCategoryQuery({
    id: parseInt(categoryId),
  });
  return (
    <Box component="div" className="categoryDetailSection">
      <BackBtn />
      <h1 className="main-heading">{categoryData?.name}</h1>
      <FolderSection categoryData={categoryData} />
    </Box>
  );
};

export default CategoryDetailSection;
