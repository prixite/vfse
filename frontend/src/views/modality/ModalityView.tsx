import ModalitySection from "@src/components/common/Smart/ModalitySection/ModalitySection";
import { useOrganizationsListQuery } from "@src/store/reducers/api";
import OrganizationSectionSkeleton from "@src/components/common/Presentational/OrganizationSectionSkeleton/OrganizationSectionSkeleton";
export default function ModalityView() {
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  return (
    <>
      {!isLoading ? <ModalitySection /> : <OrganizationSectionSkeleton />}
    </>
  );
}
