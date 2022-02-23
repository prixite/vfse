// import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import { Box, Grid } from "@mui/material";

import TableSkeleton from "@src/components/common/Presentational/TableSkeleton/TableSkeleton";
import CountingInfoSection from "@src/components/common/Smart/CountingInfoSection/CountingInfoSection";
import LastActiveUsers from "@src/components/common/Smart/LastActiveUser/LastActiveUser";
import TopicUpdatesSection from "@src/components/common/Smart/TopicUpdatesSection/TopicUpdatesSection";
import WorkOrderSection from "@src/components/common/Smart/WorkOrderSection/WorkOrderSection";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsSeatsListQuery } from "@src/store/reducers/api";
import "@src/components/common/Smart/FaqSection/FaqSection.scss";

export default function FaqSection() {
  const selectedOrganization = useSelectedOrganization();

  const { isLoading } = useOrganizationsSeatsListQuery({
    id: selectedOrganization.id.toString(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="VfseDashboardSection">
      <h2 className="heading">Dashboard</h2>
      <CountingInfoSection />
      <Box className="WorkOrderSection">
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <WorkOrderSection />
          </Grid>
          <Grid item xs={5}>
            <LastActiveUsers />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TopicUpdatesSection />
        </Grid>
      </Box>
    </div>
  );
}
