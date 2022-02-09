import TableSkeleton from "@src/components/common/Presentational/TableSkeleton/TableSkeleton";
import UserSection from "@src/components/common/Smart/UserSection/UserSection";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsUsersListQuery } from "@src/store/reducers/api";
export default function UserView() {
  const selectedOrganization = useSelectedOrganization();

  const { isLoading } = useOrganizationsUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  return <>{!isLoading ? <UserSection /> : <TableSkeleton />}</>;
}
