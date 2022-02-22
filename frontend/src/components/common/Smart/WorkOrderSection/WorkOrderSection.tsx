import { Box } from "@mui/material";

import "@src/components/common/Smart/WorkOrderSection/WorkOrderSection.scss";
import WorkOrderCell from "@src/components/common/Presentational/WorkOrderCell/WorkOrderCell";

const WorkOrderSection = () => {
  return (
    <Box component="div" className="WorkOrderSection">
      <div className="heading_section">
        <h2 className="heading">Work Orders</h2>
        <h3 className="subheading">See All</h3>
      </div>
      <div className="WorkOrderSectionBottom">
        <WorkOrderCell />
      </div>
    </Box>
  );
};

export default WorkOrderSection;
