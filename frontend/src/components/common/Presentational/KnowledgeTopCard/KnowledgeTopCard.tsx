import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Box } from "@mui/material";
import fileImage from '@src/assets/svgs/fileImage.svg';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard.scss";
interface props {
  title: string
}

const KnowledgeTopCard = ({ title}: props) => {
  return (
    <div className="knowledge-top-card">
      <Box component="div" className="card">
          <img  src={fileImage}/>
          <h2 className="title"> {title}</h2>
        <div className="info">
          <p className="category">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
          </p>
        </div>
      </Box>
    </div>
  );
};

export default KnowledgeTopCard;
