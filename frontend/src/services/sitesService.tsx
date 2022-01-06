const updateSitesService = async (id, sites, updateSites, refetch) => {
  await updateSites({
    id: id.toString(),
    organizationSite: { sites: [...sites] },
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};

export { updateSitesService };
