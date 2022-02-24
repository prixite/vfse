import { Box } from "@mui/material";

import "@src/components/common/Smart/WorkOrderSection/WorkOrderSection.scss";
import WorkOrderCell from "@src/components/common/Presentational/WorkOrderCell/WorkOrderCell";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";

const { workOrders, seeAll } = localizedData().Faq;

const WorkOrderSection = () => {
  const [browserWidth] = useWindowSize();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <Box component="div" className="WorkOrderSection">
          <div className="heading_section">
            <h2 className="heading">{workOrders}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <div className="WorkOrderSectionBottom">
            <WorkOrderCell />
          </div>
        </Box>
      ) : (
        <Box component="div" className="mobileWorkOrderSection">
          <div className="heading_section">
            <h2 className="heading">{workOrders}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <div className="WorkOrderSectionBottom">
            <WorkOrderCell />
          </div>
        </Box>
      )}
    </>
  );
};

export default WorkOrderSection;
