import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import SystemSection from "@src/components/common/Smart/SystemSection/SystemSection";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsSystemsListQuery,
  useSitesSystemsListQuery,
} from "@src/store/reducers/api";

const SystemsView = () => {
  const { siteId } = useParams();
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { isLoading } =
    siteId == undefined
      ? useOrganizationsSystemsListQuery({
          page: 1,
          id: selectedOrganization?.id?.toString(),
        })
      : useSitesSystemsListQuery({ page: 1, id: siteId?.toString() });

  return <>{!isLoading ? <SystemSection /> : <SectionSkeleton />}</>;
};

export default SystemsView;
