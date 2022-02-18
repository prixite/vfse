import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box } from "@mui/material";

import { hexToRgb } from "@src/helpers/utils/utils";
import "@src/components/common/Presentational/ArticleCard/ArticleCard.scss";
interface props {
  color: string;
}

const ArticleCard = ({ color }: props) => {
  return (
    <div className="Article-card">
      <Box component="div" className="card">
          <FolderRoundedIcon style={{ color: color, fontSize: '2.2em' }} />
        <div className="heading">
          <h2 className="title">
            {" "}
            Getting started
          </h2>
        </div>
        <div className="article-info">
        <div className="article-no">
          <TextsmsOutlinedIcon
            style={{ color: "#696F77", fontSize: "1em", marginRight: "10px" }}
          />
          <p>8 articles</p>
        </div>
        <div className="explore">
          <p className="text" style={{ color: "#696F77" }}>
            Explore
          </p>
          <ArrowRightAltIcon style={{ color: "#696F77" }} />
        </div>
        </div>
      </Box>
    </div>
  );
};

export default ArticleCard;
