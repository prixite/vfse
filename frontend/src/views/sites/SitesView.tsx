import { useParams } from "react-router";

import BreadCrumb from "@src/components/common/presentational/breadCrumb/BreadCrumb";
import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import SiteSection from "@src/components/common/smart/siteSection/SiteSection";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsListQuery,
  useOrganizationsReadQuery,
} from "@src/store/reducers/api";

const SitesView = () => {
  const { networkId } = useParams();
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  const selectedOrganization = useSelectedOrganization();
  const { organizationRoute, networkRoute } = constants;
  const { data: organization } = useOrganizationsReadQuery({
    id: networkId,
  });

  return (
    <>
      <BreadCrumb
        breadCrumbList={[
          {
            name: "Home",
            route: `/${organizationRoute}/${selectedOrganization?.id}/`,
          },
          {
            name: selectedOrganization?.name,
            route: `/${organizationRoute}/${selectedOrganization?.id}/${networkRoute}/`,
          },
          {
            name: organization?.name,
          },
        ]}
      />
      {!isLoading ? <SiteSection /> : <SectionSkeleton />}
    </>
  );
};

export default SitesView;
