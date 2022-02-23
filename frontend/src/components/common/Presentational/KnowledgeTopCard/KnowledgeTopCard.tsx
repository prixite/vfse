import { Box } from "@mui/material";
import { Link, useParams, useHistory } from "react-router-dom";
import fileImage from "@src/assets/svgs/fileImage.svg";
import { constants } from "@src/helpers/utils/constants";
import { RouteParam } from "@src/helpers/interfaces/appInterfaces";
import "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard.scss";
interface props {
  title: string;
  description: string;
}

const KnowledgeTopCard = ({ title, description }: props) => {
  const param: RouteParam = useParams();
  const { organizationRoute } = constants;
  const history = useHistory();
  const route = history?.location?.pathname?.includes('folder') ? `/${organizationRoute}/${param?.id}/knowledge-base/folder/${param?.folderId}/documentation/3` :  `/${organizationRoute}/${param?.id}/knowledge-base/documentation/3`;
  return (
    <div className="knowledge-top-card">
      <Link
        to={route}
        key={param?.id}
        className="knowledge-top-card"
        style={{ textDecoration: "none", height: "100%" }}
      >
        <Box component="div" className="card">
          <img src={fileImage} />
          <h2 className="title"> {title}</h2>
          <div className="info">
            <p className="category">{description}</p>
          </div>
        </Box>
      </Link>
    </div>
  );
};

export default KnowledgeTopCard;
