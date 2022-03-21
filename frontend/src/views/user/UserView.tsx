import TableSkeleton from "@src/components/common/presentational/tableSkeleton/TableSkeleton";
import UserSection from "@src/components/common/smart/userSection/UserSection";
import { useSelectedOrganization } from "@src/store/hooks";
import { useScopeUsersListQuery } from "@src/store/reducers/api";
export default function UserView() {
  const selectedOrganization = useSelectedOrganization();

  const { isLoading } = useScopeUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  return <>{!isLoading ? <UserSection /> : <TableSkeleton />}</>;
}
