import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import { useAppSelector } from "@src/store/hooks";
export default function ModalityView() {
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const { isLoading } = useOrganizationsHealthNetworksListQuery({
    page: 1,
    organizationPk: selectedOrganization.id.toString(),
  });

  return <>{!isLoading ? <ModalitySection /> : <SectionSkeleton />}</>;
}
