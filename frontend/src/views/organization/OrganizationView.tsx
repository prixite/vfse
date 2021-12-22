import OrganizationSection from "@src/components/common/Smart/OrganizationSection/OrganizationSection";
import { useApiOrganizationsListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
const OrganizationView = () => {
  const { isLoading } = useApiOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <OrganizationSection /> : <SectionSkeleton />}</>;
};

export default OrganizationView;
