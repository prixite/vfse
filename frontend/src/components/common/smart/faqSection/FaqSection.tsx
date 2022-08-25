import { Box, Grid } from "@mui/material";

import CountingInfoSection from "@src/components/common/smart/countingInfoSection/CountingInfoSection";
import LastActiveUsers from "@src/components/common/smart/lastActiveUser/LastActiveUser";
import WorkOrderSection from "@src/components/common/smart/workOrderSection/WorkOrderSection";
import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/smart/faqSection/faqSection.scss";
import TopicUpdatesSection from "../topicUpdatesSection/TopicUpdatesSection";

const { dashboard } = localizedData().Faq;
export default function FaqSection() {
  return (
    <div className="VfseDashboardSection">
      <h2 className="faqHeading">{dashboard}</h2>
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
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        marginTop={3}
        paddingTop={1}
        marginBottom={3}
        paddingBottom={1}
      >
        <TopicUpdatesSection title={`Topic updates `} seeAll={``} />
      </Grid>
    </div>
  );
}
