import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";

import { api } from "@src/store/reducers/api";

import "@src/components/common/smart/categoryDetailSection/categoryDetailSection.scss";
import FolderSection from "../folderSection/FolderSection";
const CategoryDetailSection = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categoryData } = api.useGetCategoryQuery({
    id: parseInt(categoryId),
  });
  const [value, setValue] = useState("folders");
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  return (
    <Box component="div" className="categoryDetailSection">
      <h1 className="main-heading">{categoryData?.name}</h1>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          style: {
            backgroundColor: "#773CBD",
          },
        }}
      >
        {" "}
        <Tab
          value="folders"
          sx={{
            "&.Mui-selected": {
              color: "#773CBD",
            },
          }}
          label="Folders"
          className="tab-style"
        />
      </Tabs>
      <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      {value === "folders" ? <FolderSection categoryData={categoryData} /> : ""}
    </Box>
  );
};

export default CategoryDetailSection;
