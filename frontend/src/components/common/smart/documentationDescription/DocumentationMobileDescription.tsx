import { useState } from "react";

import { Grid } from "@mui/material";

import ArticleDescriptionCard from "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard";
import ArticleOverviewCard from "@src/components/common/Presentational/ArticleOverviewCard/ArticleOverviewCard";
import DocumentationBtnSection from "@src/components/common/Presentational/DocumentationBtnSection/DocumentationBtnSection";

interface mobileDescription {
  overview: string;
  title: string;
}
const DocumentationMobileDescription = ({
  overview,
  title,
}: mobileDescription) => {
  const [editText, setEditText] = useState(false);

  const handleEditText = (val) => setEditText(val);
  return (
    <>
      <h1 className="title">{title}</h1>
      <Grid container spacing={5}>
        <Grid item={true} xs={12} lg={5} xl={4} md={5}>
          <DocumentationBtnSection
            handleEditText={handleEditText}
            editText={editText}
          />
          <ArticleOverviewCard />
        </Grid>
        <Grid
          item={true}
          xs={12}
          lg={7}
          xl={8}
          md={7}
          style={{ paddingTop: "20px" }}
        >
          <ArticleDescriptionCard overview={overview} />
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentationMobileDescription;
