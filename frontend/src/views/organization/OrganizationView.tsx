import OrganizationSection from "@src/components/common/Smart/OrganizationSection/OrganizationSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
const OrganizationView = () => {
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <OrganizationSection /> : <SectionSkeleton />}</>;
};

export default OrganizationView;
