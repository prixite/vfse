import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import { useAppSelector } from "@src/store/hooks";
export default function ModalityView() {
  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const { isLoading } = useOrganizationsHealthNetworksListQuery({
    page: 1,
    organizationPk: currentOrganization.id.toString(),
  });

  return <>{!isLoading ? <ModalitySection /> : <SectionSkeleton />}</>;
}
