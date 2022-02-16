import { Grid, Box } from "@mui/material";

import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import "@src/components/common/Smart/KnowledgeSection/KnowledgeSection.scss";

const topData = [
  {
    color: "#773CBD",
    number: 1,
  },
  {
    color: "#FF8F28",
    number: 2,
  },
  {
    color: "#92D509",
    number: 3,
  },
  {
    color: "#6A5FE6",
    number: 4,
  },
];

const KnowledgeSection = () => {
  return (
    <Box component="div" className="knowledgeSection">
      <h1 className="main-heading">Knowledge base</h1>
      <TopViewBtns path="documentation" />
      <h2 className="sub-heading">Top Help Articles</h2>
      <Grid container spacing={2}>
        {topData.map((item, index) => (
          <Grid item={true} xs={3} key={index}>
            <KnowledgeTopCard color={item?.color} number={item?.number} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KnowledgeSection;
