import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import { useOrganizationsHealthNetworksListQuery } from "@src/store/reducers/api";
import OrganizationSectionSkeleton from "@src/components/common/Presentational/OrganizationSectionSkeleton/OrganizationSectionSkeleton";
import { useAppSelector } from "@src/store/hooks";
export default function ModalityView() {
  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const { isLoading } = useOrganizationsHealthNetworksListQuery({
    page: 1,
    organizationPk: currentOrganization.id.toString()
  })

  return (
    <>
      {!isLoading ? <ModalitySection /> : <OrganizationSectionSkeleton />}
    </>
  );
}
