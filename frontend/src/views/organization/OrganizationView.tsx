import OrganizationSection from "@src/components/common/Smart/OrganizationSection/OrganizationSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
const OrganizationView = () => {
  const { isLoading } = useOrganizationsListQuery();
  return <>{!isLoading ? <OrganizationSection /> : <p>Loading</p>}</>;
};

export default OrganizationView;
