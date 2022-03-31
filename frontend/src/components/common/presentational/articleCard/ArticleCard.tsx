import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/presentational/articleCard/articleCard.scss";
interface props {
  color: string;
  title: string;
  articleNo: string;
  id: number;
}

const ArticleCard = ({ color, title, articleNo, id: folderId }: props) => {
  const constantData: LocalizationInterface = localizedData();
  const { explore, numberTitle } = constantData.articleCard;
  const { organizationRoute } = constants;
  const { id } = useParams();
  return (
    <div className="Article-card">
      <Link
        to={`/${organizationRoute}/${id}/knowledge-base/folder/${folderId}`}
        key={id}
        className="Article-card"
        style={{ textDecoration: "none", height: "100%" }}
      >
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
                style={{
                  color: "#696F77",
                  fontSize: "1em",
                  marginRight: "10px",
                }}
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
      </Link>
    </div>
  );
};

export default ArticleCard;
