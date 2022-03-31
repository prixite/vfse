import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import AllCategoriesSection from "@src/components/common/smart/allCategoriesSection/AllCategoriesSection";
import KnowledgeBaseHome from "@src/components/common/smart/knowledgeBaseHome/KnowledgeBaseHome";
import SeeAllArticles from "@src/components/common/smart/seeAllArticles/SeeAllArticles";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/smart/knowledgeSection/knowledgeSection.scss";

const KnowledgeSection = () => {
  const constantData: LocalizationInterface = localizedData();
  const { title } = constantData.knowledgeBase;
  const [value, setValue] = useState("home");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderSelectedTab = () => {
    switch (value) {
      case "home":
        return <KnowledgeBaseHome />;
      case "categories":
        return <AllCategoriesSection />;
      case "articles":
        return <SeeAllArticles />;
    }
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
        {" "}
        <Tab
          value="home"
          sx={{
            "&.Mui-selected": {
              color: "#773CBD",
            },
          }}
          label="Home"
          className="tab-style"
        />
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
      {renderSelectedTab()}
    </Box>
  );
};

export default KnowledgeSection;
