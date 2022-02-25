
import ArticleDescriptionCard from "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard";
import ArticleOverviewCard from "@src/components/common/Presentational/ArticleOverviewCard/ArticleOverviewCard"; 
import DocumentationBtnSection from "@src/components/common/Presentational/DocumentationBtnSection/DocumentationBtnSection";
import { Grid } from "@mui/material";

interface mobileDescription {
    overview: string;
    description: string;
    startGuide: string;
    title: string;
    img: string;
}
const DocumentationMobileDescription = ({overview, description, startGuide, title, img}: mobileDescription) => (
    <>
     <h1 className="title">{title}</h1>
    <Grid container spacing={5} >
        <Grid item={true} xs={12} lg={5} xl={4} md={5}>
          <DocumentationBtnSection/>
          <ArticleOverviewCard />
        </Grid>
        <Grid item={true} xs={12} lg={7} xl={8} md={7} style={{ paddingTop: "20px" }}>
          <ArticleDescriptionCard
            overview={overview}
            description={description}
            startGuide={startGuide}
            img={img}
          />
        </Grid>
      </Grid>
      </>
)

export default DocumentationMobileDescription;