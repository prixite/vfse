import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import CountingInfoSection from "@src/components/common/smart/countingInfoSection/CountingInfoSection";
import LastActiveUsers from "@src/components/common/smart/lastActiveUser/LastActiveUser";
import WorkOrderSection from "@src/components/common/smart/workOrderSection/WorkOrderSection";

import "@src/components/common/smart/faqSection/faqSection.scss";
import TopicUpdatesSection from "../topicUpdatesSection/TopicUpdatesSection";

export default function FaqSection() {
  const { t } = useTranslation();
  return (
    <div className="VfseDashboardSection">
      <h2 className="faqHeading">{t("Dashboard")}</h2>
      {/* CountingInfoSection  */}
      <CountingInfoSection />

      {/* WorkOrderSection  */}
      <Box className="WorkOrderSection">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={7}>
            <WorkOrderSection />
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <LastActiveUsers />
          </Grid>
        </Grid>
        <Grid item xs={12}></Grid>
      </Box>

      {/* Topic update Section  */}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        marginTop={2}
        paddingTop={1}
        marginBottom={2}
        paddingBottom={1}
      >
        <TopicUpdatesSection title={`Topic updates `} seeAll={``} />
      </Grid>
    </div>
  );
}
