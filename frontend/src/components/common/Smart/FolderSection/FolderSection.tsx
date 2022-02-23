import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Grid, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { localizedData } from "@src/helpers/utils/language";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import KnowledgeTopCard from "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { constants } from "@src/helpers/utils/constants";
import "@src/components/common/Smart/FolderSection/FolderSection.scss";

const topData =
{
  folderName: "Folder name",
  results: [
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
  {
    title: "Get started",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
  },
]
}

const FolderSection = () => {
  const { id } = useParams();
  const localization : LocalizationInterface = localizedData();
  const { backBtn } = localization.folderSection
  const { organizationRoute } = constants;
  return (
    <Box component="div" className="folder-heading">
      <Link
        to={`/${organizationRoute}/${id}/knowledge-base`}
        key={id}
        style={{ textDecoration: "none", height: "100%" }}
      >
        <div className="back-btn">
          <ArrowRightAltIcon
            style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
          />
          <p className="back-text">{backBtn}</p>
        </div>
      </Link>
      <h2 className="main-heading">{topData?.folderName}</h2>
      <TopViewBtns path="documentation" />
      <Grid container spacing={1} style={{marginTop: "30px"}}>
        {topData?.results?.map((item, index) => (
          <Grid item={true} xs={6} xl={2} md={3} key={index}>
            <KnowledgeTopCard title={item?.title} description={item?.description}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FolderSection;
