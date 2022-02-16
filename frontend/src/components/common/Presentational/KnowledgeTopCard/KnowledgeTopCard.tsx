import { Box } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "@src/components/common/Presentational/KnowledgeTopCard/KnowledgeTopCard.scss";

const KnowledgeTopCard = ({color, number}) => {
  return (
    <div className="knowledge-top-card">
      <Box component="div" className="card">
          <div className="circle" style={{backgroundColor: color}}>
          </div>
          <div className="heading">
                <h1 className="number" style={{color: color}}>{number}</h1>
                <h2 className="title"> Getting started</h2>
            </div>
        <div className="info">
          <p className="category">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus tempor.</p>
        </div>
        <div className="explore">
          <p className="text" style={{color: color}}>Explore</p>
          <ArrowRightAltIcon style={{color: color}}/>
        </div>
      </Box>
    </div>
  );
};

export default KnowledgeTopCard;