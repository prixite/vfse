import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

import AllCategoriesSection from "@src/components/common/smart/allCategoriesSection/AllCategoriesSection";
import KnowledgeBaseHome from "@src/components/common/smart/knowledgeBaseHome/KnowledgeBaseHome";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import SeeAllArticles from "@src/components/common/smart/seeAllArticles/SeeAllArticles";

const KnowledgeSection = () => {
  const { t } = useTranslation();
  const classes = useStyles();
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
    <Box component="div" className={classes.knowledgeSection}>
      <h1 className={classes.mainHeading}>{t("Knowledge base")}</h1>
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
          label={t("See All Categories")}
          className={classes.tabStyle}
        />
        <Tab
          value="articles"
          label={"See All Articles"}
          className={classes.tabStyle}
        />
      </Tabs>
      <hr style={{ borderTop: "1px solid #D4D6DB", marginBottom: "32px" }} />
      {renderSelectedTab()}
    </Box>
  );
};

export default KnowledgeSection;
