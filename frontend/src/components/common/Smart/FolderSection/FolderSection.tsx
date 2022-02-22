import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Grid, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { constants } from "@src/helpers/utils/constants";
import "@src/components/common/Smart/KnowledgeSection/KnowledgeSection.scss";

const topData = [
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
  {
    title: "Get started",
  },
];

const FolderSection = () => {
  const { id } = useParams();
  const { organizationRoute } = constants;
  return (
    <Box component="div" className="knowledgeSection">
      <Link
        to={`/${organizationRoute}/${id}/knowledge-base`}
        key={id}
        style={{ textDecoration: "none", height: "100%" }}
      >
        <div>
          <ArrowRightAltIcon
            style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
          />
        </div>
      </Link>
      <TopViewBtns path="documentation" />
      <h2 className="sub-heading">Folder name</h2>
      <Grid container spacing={1}>
        {topData.map((item, index) => (
          <Grid item={true} xs={6} xl={2} md={3} key={index}>
            <KnowledgeTopCard title={item?.title} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FolderSection;
