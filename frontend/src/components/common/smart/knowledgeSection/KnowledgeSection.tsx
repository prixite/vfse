import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import AllCategoriesSection from "@src/components/common/smart/allCategoriesSection/AllCategoriesSection";
import KnowledgeBaseHome from "@src/components/common/smart/knowledgeBaseHome/KnowledgeBaseHome";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import SeeAllArticles from "@src/components/common/smart/seeAllArticles/SeeAllArticles";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";

const KnowledgeSection = () => {
  const classes = useStyles();
  const constantData: LocalizationInterface = localizedData();
  const { title } = constantData.knowledgeBase;
  const { home, categories, articles, labelArticle, labelCategory } =
    constantsData.knowledgeSections;
  const [value, setValue] = useState("home");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderSelectedTab = () => {
    switch (value) {
      case home:
        return <KnowledgeBaseHome />;
      case categories:
        return <AllCategoriesSection />;
      case articles:
        return <SeeAllArticles />;
    }
  };

  return (
    <Box component="div" className={classes.knowledgeSection}>
      <h1 className={classes.mainHeading}>{title}</h1>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        visibleScrollbar={false}
        orientation="horizontal"
      >
        {" "}
        <Tab value="home" label="Home" className={classes.tabStyle} />
        <Tab
          value="categories"
          label={labelCategory}
          className={classes.tabStyle}
        />
        <Tab
          value="articles"
          label={labelArticle}
          className={classes.tabStyle}
        />
      </Tabs>
      <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      {renderSelectedTab()}
    </Box>
  );
};

export default KnowledgeSection;
