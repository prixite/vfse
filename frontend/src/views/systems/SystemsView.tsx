import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import SystemSection from "@src/components/common/Smart/SystemSection/SystemSection";
import { useOrganizationsSystemsListQuery } from "@src/store/reducers/api";
const SystemsView = () => {
  const { isLoading } = useOrganizationsSystemsListQuery({ page: 1 });
  return <>{!isLoading ? <SystemSection /> : <SectionSkeleton />}</>;
};

export default SystemsView;
