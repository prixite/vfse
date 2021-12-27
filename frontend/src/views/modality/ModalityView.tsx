import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
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
