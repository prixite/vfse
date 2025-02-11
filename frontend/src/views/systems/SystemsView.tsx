import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import SystemSection from "@src/components/common/smart/systemSection/SystemSection";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsSystemsListQuery } from "@src/store/reducers/api";

const SystemsView = () => {
  const { siteId, networkId } = useParams();
  const selectedOrganization = useSelectedOrganization();
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

  return !isLoading ? <SystemSection /> : <SectionSkeleton />;
};

export default SystemsView;
