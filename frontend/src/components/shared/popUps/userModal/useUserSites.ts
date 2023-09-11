import { useEffect, useState } from "react";
import {
  MetaSite,
  OrganizationsHealthNetworksListApiResponse,
  OrganizationsSitesListApiResponse,
} from "@src/store/reducers/generatedWrapper";

type SitesType = {
  networksData: OrganizationsHealthNetworksListApiResponse;
  organizationSitesData: OrganizationsSitesListApiResponse;
  userSites: string[];
};

export default function useUserSite({
  networksData,
  organizationSitesData,
  userSites,
}: SitesType) {
  const [sites] = useState(new Map());

  useEffect(() => {
    if (networksData?.length && userSites?.length) {
      for (const site of networksData) {
        addSitesToSitesSet(site.sites);
      }
    }
  }, [networksData, userSites]);

  useEffect(() => {
    if (organizationSitesData?.length && userSites?.length)
      addSitesToSitesSet(organizationSitesData);
  }, [organizationSitesData, userSites]);

  const addSitesToSitesSet = (
    sitesList: MetaSite[] | OrganizationsSitesListApiResponse
  ) => {
    sitesList?.forEach((site) => {
      siteExistInUserSites(site);
    });
  };

  const siteExistInUserSites = (site: MetaSite) => {
    for (const _site of userSites) {
      if (_site === site?.name) {
        sites.set(site.id, site);
      }
    }
  };

  return sites;
}
