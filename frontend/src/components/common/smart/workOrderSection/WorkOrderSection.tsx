import { Box } from "@mui/material";
import "@src/components/common/smart/workOrderSection/workOrderSection.scss";
import { useParams, Link } from "react-router-dom";

import WorkOrderCell from "@src/components/common/presentational/workOrderCell/WorkOrderCell";
import { constants } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";

const WorkOrderSection = () => {
  const { organizationRoute } = constants;
  const { id } = useParams<{ id?: string }>();
  const { workOrders, seeAll } = localizedData().Faq;
  return (
    <>
      <Box component="div" className="WorkOrderSection">
        <div className="heading_section">
          <h2 className="heading">{workOrders}</h2>
          <Link
            className="subheading"
            to={`/${organizationRoute}/${id}/systems/`}
          >
            {seeAll}
          </Link>
        </div>
        <div className="WorkOrderSectionBottom">
          <WorkOrderCell />
        </div>
      </Box>
    </>
  );
};

export default WorkOrderSection;
