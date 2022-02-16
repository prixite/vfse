import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box } from "@mui/material";

import { hexToRgb } from "@src/helpers/utils/utils";
import "@src/components/common/Presentational/ArticleCard/ArticleCard.scss";
interface props {
  color: string;
}

const ArticleCard = ({ color}: props) => {
  return (
    <div className="Article-card">
      <Box component="div" className="card">
        <div
          className="circle"
          style={{ background: `${hexToRgb(color, 0.3)}` }}
        >
          <InsertDriveFileOutlinedIcon style={{ color: color }} />
        </div>
        <div className="heading">
          <h2 className="title" style={{ color: color }}>
            {" "}
            Getting started
          </h2>
        </div>
        <div className="article-no">
          <TextsmsOutlinedIcon
            style={{ color: "#696F77", fontSize: "1em", marginRight: "10px" }}
          />
          <p>8 articles</p>
        </div>
        <div className="explore">
          <p className="text" style={{ color: color }}>
            Explore
          </p>
          <ArrowRightAltIcon style={{ color: color }} />
        </div>
      </Box>
    </div>
  );
};

export default ArticleCard;
