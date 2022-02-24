import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Box, Grid, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import ArticleDescriptionCard from "@src/components/common/Presentational/ArticleDescriptionCard/ArticleDescriptionCard";
import ArticleOverviewCard from "@src/components/common/Presentational/ArticleOverviewCard/ArticleOverviewCard";
import { constants } from "@src/helpers/utils/constants";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Smart/DocumentationDescription/DocumentationDescription.scss";
const obj = {
  overview:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
  startGuide:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. ",
};

const DocumentationDescription = () => {
  const { id } = useParams();
  const { organizationRoute } = constants;
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <Box component="div" className="documentation-section">
      <div>
        <Link
          to={`/${organizationRoute}/${id}/knowledge-base`}
          key={id}
          className="back-btn"
          style={{ textDecoration: "none", height: "100%" }}
        >
          <div className="back-btn">
            <ArrowRightAltIcon
              style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
            />
            <p className="back-text">Back</p>
          </div>
        </Link>
      </div>
      <Grid container spacing={5} style={{ marginTop: "20px" }}>
        <Grid item={true} xs={9} style={{ paddingTop: "8px" }}>
          <h1 className="title">Getting started</h1>
          <ArticleDescriptionCard
            overview={obj.overview}
            description={obj.description}
            startGuide={obj.startGuide}
          />
        </Grid>
        <Grid item={true} xs={3}>
          <Grid container spacing={2} style={{ marginBottom: "20px" }}>
            <Grid item={true} xs={6}>
              <Button
                className="btn"
                style={{
                  backgroundColor: secondaryColor,
                  color: buttonTextColor,
                }}
              >
                <ModeEditOutlineOutlinedIcon style={{ marginRight: "10px" }} />
                <span>Edit</span>
              </Button>
            </Grid>
            <Grid item={true} xs={6}>
              <Button
                className="btn"
                style={{
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }}
              >
                <InsertLinkOutlinedIcon
                  style={{ transform: "rotate(120deg)", marginRight: "10px" }}
                />
                <span> Copy link </span>
              </Button>
            </Grid>
          </Grid>
          <ArticleOverviewCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentationDescription;
