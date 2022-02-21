import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box } from "@mui/material";

import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/Presentational/ArticleCard/ArticleCard.scss";
interface props {
  color: string;
  title: string;
  articleNo: number;
}

const ArticleCard = ({ color, title, articleNo }: props) => {
  const constantData: LocalizationInterface = localizedData();
  const { explore, numberTitle } = constantData.articleCard;
  return (
    <div className="Article-card">
      <Box component="div" className="card">
        <div className="general-info">
          <FolderRoundedIcon style={{ color: color, fontSize: "2.2em" }} />
          <div className="heading">
            <h2 className="title">{title}</h2>
          </div>
        </div>
        <div className="article-info">
          <div className="article-no">
            <TextsmsOutlinedIcon
              style={{ color: "#696F77", fontSize: "1em", marginRight: "10px" }}
            />
            <p>{`${articleNo} ${numberTitle}`}</p>
          </div>
          <div className="explore">
            <p className="text" style={{ color: "#696F77" }}>
              {explore}
            </p>
            <ArrowRightAltIcon style={{ color: "#696F77" }} />
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ArticleCard;
