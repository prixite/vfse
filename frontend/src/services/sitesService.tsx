import { toast } from "react-toastify";

const updateSitesService = async (
  id,
  sites,
  updateSites,
  refetch,
  type,
  refetchOrgorNetwork,
  refetchAssociatedSites,
  orgNetworkRefetch
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
            refetchAssociatedSites();
            refetch();
            refetchOrgorNetwork();
            orgNetworkRefetch();
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
  refetchOrgorNetwork,
  refetchAllSites,
  orgNetworkRefetch
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
          console.log(refetchAllSites);
          refetchAllSites();
          refetch();
          refetchOrgorNetwork();
          orgNetworkRefetch();
        },
      });
    });
};

export { updateSitesService, addNewSiteService };
