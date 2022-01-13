import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import SystemSection from "@src/components/common/Smart/SystemSection/SystemSection";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSystemsListQuery } from "@src/store/reducers/api";

const SystemsView = () => {
  const { siteId, networkId } = useParams();
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const apiParams = {
    page: 1,
    id: selectedOrganization?.id?.toString(),
  };
  if (siteId) {
    apiParams.site = siteId.toString();
  }
  if (networkId) {
    apiParams.health_network = networkId.toString();
  }

  const { isLoading } = useOrganizationsSystemsListQuery(apiParams);

  return <>{!isLoading ? <SystemSection /> : <SectionSkeleton />}</>;
};

export default SystemsView;
