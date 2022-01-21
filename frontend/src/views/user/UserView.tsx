import UserSection from "@src/components/common/Smart/UserSection/UserSection";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsUsersListQuery } from "@src/store/reducers/api";
export default function UserView() {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { isLoading } = useOrganizationsUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  return <>{!isLoading ? <UserSection /> : <p>Loading...</p>}</>;
}
