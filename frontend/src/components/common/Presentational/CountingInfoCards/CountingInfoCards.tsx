import { Box } from "@mui/material";
import "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards.scss";

interface CountingInfoCards {
  deviceNo: string;
  deviceStatus: string;
  deviceImage: string;
}

const CountingInfoCards = ({
  deviceNo,
  deviceStatus,
  deviceImage,
}: CountingInfoCards) => {
  return (
    <div className="countingInfo">
      <Box component="div" className="card">
        <img src={deviceImage} className="imgStyling" />
        <div className="info">
          <p className="number">{deviceNo}</p>
          <p className="category">{deviceStatus}</p>
        </div>
      </Box>
    </div>
  );
};

export default CountingInfoCards;
