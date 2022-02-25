import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Box, Grid } from "@mui/material";
import { Link, useParams, useHistory } from "react-router-dom";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import DocumentationBtnSection from "@src/components/common/Presentational/DocumentationBtnSection/DocumentationBtnSection";
import ArticleDescriptionCard from "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard";
import DocumentationMobileDescription from "./DocumentationMobileDescription";
import ArticleOverviewCard from "@src/components/common/Presentational/ArticleOverviewCard/ArticleOverviewCard";
import { RouteParam } from "@src/helpers/interfaces/appInterfaces";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { mobileWidth } from "@src/helpers/utils/config";

import "@src/components/common/Smart/DocumentationDescription/DocumentationDescription.scss";
const obj = {
  overview:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
  startGuide:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
  image: "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png"
};

const DocumentationDescription = () => {
  const param: RouteParam = useParams();
  const [browserWidth] = useWindowSize();
  const localization: LocalizationInterface = localizedData();
  const { backBtn, title } = localization.document;
  const history = useHistory();
  const { organizationRoute } = constants;
  const route = history?.location?.pathname?.includes("folder")
    ? `/${organizationRoute}/${param?.id}/knowledge-base/folder/${param?.folderId}`
    : `/${organizationRoute}/${param?.id}/knowledge-base`;
  return (
    <Box component="div" className="documentation-section">
      <div>
        <Link
          className="back-btn"
          style={{ textDecoration: "none", height: "100%" }}
          to={route}
        >
          <div className="back-btn">
            <ArrowRightAltIcon
              style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
            />
            <p className="back-text">{backBtn}</p>
          </div>
        </Link>
      </div>
      {
        browserWidth < mobileWidth && browserWidth !== 0 ? 
        <DocumentationMobileDescription overview={obj.overview} title={title} description={obj.description}
        startGuide={obj.startGuide} img={obj.image}/>
        :
        <Grid container spacing={5} style={{ marginTop: "20px" }}>
        <Grid item={true} xs={12} lg={7} xl={9} md={7} style={{ paddingTop: "8px" }}>
          <h1 className="title">{title}</h1>
          <ArticleDescriptionCard
            overview={obj.overview}
            description={obj.description}
            startGuide={obj.startGuide}
            img={obj.image}
          />
        </Grid>
        <Grid item={true} xs={12} lg={5} xl={3} md={5}>
          <DocumentationBtnSection/>
          <ArticleOverviewCard />
        </Grid>
      </Grid>
      }
    </Box>
  );
};

export default DocumentationDescription;
