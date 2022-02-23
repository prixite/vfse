import { Box } from "@mui/material";

import fileImage from "@src/assets/svgs/fileImage.svg";
import "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard.scss";
interface props {
  title: string;
  description: string;
}

const KnowledgeTopCard = ({ title, description }: props) => {
  return (
    <div className="knowledge-top-card">
      <Box component="div" className="card">
        <img src={fileImage} />
        <h2 className="title"> {title}</h2>
        <div className="info">
          <p className="category">{description}</p>
        </div>
      </Box>
    </div>
  );
};

export default KnowledgeTopCard;
