import { toast } from "react-toastify";

const updateSitesService = async (
  id,
  sites,
  updateSites,
  refetch,
  type,
  refetchOrgorNetwork,
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
          refetch();
          refetchOrgorNetwork();
          orgNetworkRefetch();
        },
      });
    });
};

export { updateSitesService, addNewSiteService };
