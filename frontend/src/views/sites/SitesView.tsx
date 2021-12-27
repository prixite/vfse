import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import SiteSection from "@src/components/common/Smart/SiteSection/SiteSection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
const SitesView = () => {
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  return <>{!isLoading ? <SiteSection /> : <SectionSkeleton />}</>;
};

export default SitesView;
