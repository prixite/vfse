import SectionSkeleton from "@src/components/common/Presentational/SectionSkeleton/SectionSkeleton";
import { useAppSelector } from "@src/store/hooks";
import { useParams } from "react-router";
import { constants } from "@src/helpers/utils/constants";
import BreadCrumb from "@src/components/common/Presentational/BreadCrumb/BreadCrumb";
import SiteSection from "@src/components/common/Smart/SiteSection/SiteSection";
import { useOrganizationsListQuery, useOrganizationsReadQuery } from "@src/store/reducers/api";

const SitesView = () => {
  const { networkId } = useParams();
  const { isLoading } = useOrganizationsListQuery({ page: 1 });
  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { organizationRoute, networkRoute } = constants;
  const { data: organization, isFetching: FetchingList } =
    useOrganizationsReadQuery({
      id: networkId
    });

  return <><BreadCrumb
  breadCrumbList = {
    [
      {
        name: selectedOrganization?.name,
        route: `/${organizationRoute}/${selectedOrganization?.id}`
      },
      {
        name: organization?.name,
        route: `/${organizationRoute}/${selectedOrganization?.id}/${networkRoute}`
      },
      {
        name: "All Sites"
      }
    ]
  }
/>{!isLoading ? <SiteSection /> : <SectionSkeleton />}</>;
};

export default SitesView;
