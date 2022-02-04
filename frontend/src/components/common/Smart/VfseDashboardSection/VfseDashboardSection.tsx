// import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import TableSkeleton from "@src/components/common/Presentational/TableSkeleton/TableSkeleton";
import CountingInfoSection from "@src/components/common/Smart/CountingInfoSection/CountingInfoSection";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSeatsListQuery } from "@src/store/reducers/api";
import "@src/components/common/Smart/VfseDashboardSection/VfseDashboardSection.scss";

export default function VfseDashboardSection() {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

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
    </div>
  );
}
