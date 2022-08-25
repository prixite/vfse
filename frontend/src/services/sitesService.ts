import { toast } from "react-toastify";
import { timeOut } from "@src/helpers/utils/constants";


const updateSitesService = async (id, sites, updateSites, type) => {
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
          autoClose: timeOut,
          pauseOnHover: false,
        }
      );
    });
};

const addNewSiteService = async (selectionID, siteObject, addNewSite) => {
  await addNewSite({
    id: selectionID?.toString(),
    metaSite: siteObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("New Site Added.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};

export { updateSitesService, addNewSiteService };
