import { toast } from "react-toastify";

const updateSitesService = async (id, sites, updateSites, refetch) => {
  await updateSites({
    id: id?.toString(),
    organizationSite: { sites: [...sites] },
  })
    .unwrap()
    .then(async () => {
      toast.success("Site deleted successfully.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    })
    .catch(() => {
      toast.error("Site deletion error.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
  refetch(); // TODO: invalidate cache instead of this.
};

const addNewSiteService = async (
  selectionID,
  siteObject,
  addNewSite,
  refetch
) => {
  await addNewSite({
    id: selectionID?.toString(),
    metaSite: siteObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("New Site Added.", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: refetch,
      });
    })
    .catch(() => {
      toast.error("Adding site failed.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
};

export { updateSitesService, addNewSiteService };
