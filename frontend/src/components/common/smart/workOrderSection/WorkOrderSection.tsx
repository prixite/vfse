import { Box } from "@mui/material";
import "@src/components/common/smart/workOrderSection/workOrderSection.scss";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import WorkOrderCell from "@src/components/common/presentational/workOrderCell/WorkOrderCell";
import { constants } from "@src/helpers/utils/constants";

const WorkOrderSection = () => {
  const { t } = useTranslation();
  const { organizationRoute } = constants;
  const { id } = useParams<{ id?: string }>();
  return (
    <>
      <Box component="div" className="WorkOrderSection">
        <div className="heading_section">
          <h2 className="heading">{t("Work Orders")}</h2>
          <Link
            className="subheading"
            to={`/${organizationRoute}/${id}/systems/`}
          >
            {t("See All")}
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
