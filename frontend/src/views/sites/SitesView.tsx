import SiteSection from "@src/components/common/Smart/SiteSection/SiteSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
const SitesView = () => {
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <SiteSection /> : <SectionSkeleton />}</>;
};

export default SitesView;
