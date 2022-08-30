import TableSkeleton from "@src/components/common/presentational/tableSkeleton/TableSkeleton";
import ActiveUserSection from "@src/components/common/smart/activeUsersSection/ActiveUsersSection";
import { useSelectedOrganization } from "@src/store/hooks";
import { useScopeUsersListQuery } from "@src/store/reducers/api";
export default function ActiveUsers() {
  const selectedOrganization = useSelectedOrganization();

  const { isLoading } = useScopeUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  return <>{!isLoading ? <ActiveUserSection /> : <TableSkeleton />}</>;
}
