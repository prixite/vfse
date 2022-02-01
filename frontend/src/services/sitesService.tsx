import { toast } from "react-toastify";

const updateSitesService = async (
  id,
  sites,
  updateSites,
  refetch,
  type,
  refetchOrganization,
  refetchNetworks
) => {
  await updateSites({
    id: id?.toString(),
    organizationSite: { sites: [...sites] },
  })
    .unwrap()
    .then(async () => {
      toast.success(
        `${
          type == "delete"
            ? "Site deleted successfully."
            : "Site updated successfully."
        }`,
        {
          autoClose: 1000,
          pauseOnHover: false,
          onClose: () => {
            refetch();
            refetchOrganization();
            refetchNetworks();
          },
        }
      );
    });
};

const addNewSiteService = async (
  selectionID,
  siteObject,
  addNewSite,
  refetch,
  refetchOrganization,
  refetchNetwork
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
        onClose: () => {
          refetch();
          refetchOrganization();
          refetchNetwork();
        },
      });
    });
};

export { updateSitesService, addNewSiteService };
