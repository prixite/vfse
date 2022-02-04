import { Box } from "@mui/material";

import FlowerIcon from "@src/assets/svgs/flower.svg";
import "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards.scss";

const CountingInfoCards = () => {
  return (
    <div className="countingInfo">
      <Box component="div" className="card">
        <img src={FlowerIcon} className="imgStyling" />
        <div className="info">
          <p className="number">2120</p>
          <p className="category">All devices</p>
        </div>
      </Box>
    </div>
  );
};

export default CountingInfoCards;
