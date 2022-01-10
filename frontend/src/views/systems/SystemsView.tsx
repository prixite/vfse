import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import SystemSection from "@src/components/common/Smart/SystemSection/SystemSection";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSystemsListQuery } from "@src/store/reducers/api";
const SystemsView = () => {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { isLoading } = useOrganizationsSystemsListQuery({
    page: 1,
    id: selectedOrganization?.id.toString(),
  });
  return <>{!isLoading ? <SystemSection /> : <SectionSkeleton />}</>;
};

export default SystemsView;
