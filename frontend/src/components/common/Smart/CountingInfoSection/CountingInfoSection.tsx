import { Box } from "@mui/material";

import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import "@src/components/common/Smart/CountingInfoSection/CountingInfoSection.scss";

const CountingInfoSection = () => {
  return (
    <Box component="div" className="CountingInfoSection">
      <div className="cardsSection">
        <CountingInfoCards />
        <CountingInfoCards />
        <CountingInfoCards />
        <CountingInfoCards />
        <CountingInfoCards />
      </div>
    </Box>
  );
};

export default CountingInfoSection;
