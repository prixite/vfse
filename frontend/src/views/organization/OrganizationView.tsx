import OrganizationSection from "@src/components/common/Smart/OrganizationSection/OrganizationSection";
import { useOrganizationsCustomersListQuery } from "@src/store/reducers/api";
import OrganizationSectionSkeleton from "@src/components/common/Presentational/OrganizationSectionSkeleton/OrganizationSectionSkeleton";
const OrganizationView = () => {
  const { isLoading } = useOrganizationsCustomersListQuery({ page: 1 });
  return (
    <>
      {!isLoading ? <OrganizationSection /> : <OrganizationSectionSkeleton />}
    </>
  );
};

export default OrganizationView;
