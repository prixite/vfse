import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import OrganizationSection from "@src/components/common/smart/organizationSection/OrganizationSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
const OrganizationView = () => {
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <OrganizationSection /> : <SectionSkeleton />}</>;
};

export default OrganizationView;
