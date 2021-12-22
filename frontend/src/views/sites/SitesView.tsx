import SiteSection from "@src/components/common/Smart/SiteSection/SiteSection";
import { useApiOrganizationsListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
const SitesView = () => {
  const { isLoading } = useApiOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <SiteSection /> : <SectionSkeleton />}</>;
};

export default SitesView;
