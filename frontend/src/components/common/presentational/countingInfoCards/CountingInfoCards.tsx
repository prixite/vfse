import { Box } from "@mui/material";

import "@src/components/common/presentational/countingInfoCards/countingInfoCards.scss";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";

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
  const [browserWidth] = useWindowSize();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <div className="countingInfo">
          <Box component="div" className="card">
            <img src={deviceImage} className="imgStyling" />
            <div className="info">
              <p className="number">{deviceNo}</p>
              <p className="category">{deviceStatus}</p>
            </div>
          </Box>
        </div>
      ) : (
        <div className="mobilecountingInfo">
          <Box component="div" className="card">
            <img src={deviceImage} className="imgStyling" />
            <div className="info">
              <p className="number">{deviceNo}</p>
              <p className="category">{deviceStatus}</p>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default CountingInfoCards;
