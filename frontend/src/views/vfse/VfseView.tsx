import SystemCard from "@src/components/common/Presentational/SystemCard/SystemCard";
import TableSkeleton from "@src/components/common/Presentational/TableSkeleton/TableSkeleton";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSeatsListQuery } from "@src/store/reducers/api";

export default function VfseView() {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { isLoading, data } = useOrganizationsSeatsListQuery({
    id: selectedOrganization.id.toString(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <h2>vFSE</h2>
      {data?.map((item, key) => (
        <SystemCard key={key} system={item.system} />
      ))}
    </>
  );
}
