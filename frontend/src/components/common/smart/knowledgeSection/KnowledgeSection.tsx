import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/smart/knowledgeSection/knowledgeSection.scss";
import AllCategoriesSection from "../allCategoriesSection/AllCategoriesSection";
import SeeAllArticles from "../seeAllArticles/SeeAllArticles";

const KnowledgeSection = () => {
  const constantData: LocalizationInterface = localizedData();
  const { title } = constantData.knowledgeBase;
  const [value, setValue] = useState("articles");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">{title}</h1>
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
        <Tab
          value="categories"
          sx={{
            "&.Mui-selected": {
              color: "#773CBD",
            },
          }}
          label="See All Categories"
          className="tab-style"
        />
        <Tab
          value="articles"
          sx={{
            "&.Mui-selected": {
              color: "#773CBD",
            },
          }}
          label="See All Articles"
          className="tab-style"
        />
      </Tabs>
      <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      {value === "categories" ? <AllCategoriesSection /> : <SeeAllArticles />}
    </Box>
  );
};

export default KnowledgeSection;
