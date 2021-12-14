import OrganizationSection from "@src/components/common/Smart/OrganizationSection/OrganizationSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import OrganizationSectionSkeleton from "@src/components/common/Presentational/OrganizationSectionSkeleton/OrganizationSectionSkeleton";
const OrganizationView = () => {
  const { isLoading } = useOrganizationsListQuery();
  return (
    <>
      {!isLoading ? <OrganizationSection /> : <OrganizationSectionSkeleton />}
    </>
  );
};

export default OrganizationView;
