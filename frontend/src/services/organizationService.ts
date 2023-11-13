import { toast } from "react-toastify";

import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";

const DeleteOrganizationService = async (id, deleteOrganization) => {
  await deleteOrganization({
    id: id.toString(),
  }).unwrap();
};
const updateOrganizationService = async (
  id,
  organization,
  updateOrganization
) => {
  await updateOrganization({ id, organization })
    .unwrap()
    .then(async () => {
      toast.success("Organization successfully updated.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};

const addNewOrganizationService = async (
  organization,
  addNewOrganization,
  setOrganizationID
) => {
  await addNewOrganization({
    organization: organization,
  })
    .unwrap()
    .then((response) => {
      toast.success("Organization created successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
      setOrganizationID(response?.id);
    });
};

const updateHealthNetworkService = async (
  id,
  organization,
  updateOrganization,
  updateOrganizationSites,
  sites
) => {
  await updateOrganization({ id, organization })
    .unwrap()
    .then(async (response) => {
      toast.success("Health network successfully updated.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
      await updateOrganizationSites({
        id: response?.id,
        organizationSite: { sites: [...sites] },
      }).unwrap();
    });
};

const addNewHealthNetworkService = async (
  id,
  organization,
  addHealthNetwork,
  updateOrganizationSites,
  sites
) => {
  await addHealthNetwork({
    id: id.toString(),
    healthNetwork: organization,
  })
    .unwrap()
    .then(async (response) => {
      toast.success("Health network created successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
      await updateOrganizationSites({
        id: response?.id,
        organizationSite: { sites: [...sites] },
      }).unwrap();
    });
};

const addNewHealthNetworksService = async (
  organizationId,
  addNewNetworks,
  networks
) => {
  await addNewNetworks({
    id: organizationId,
    organizationHealthNetwork: { health_networks: [...networks] },
  })
    .unwrap()
    .then(() => {
      toast.success("Network Updated Successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    })
    .catch((err) => {
      toastAPIError("Unable to add HealthNetwork.", err.status, err.data);
    });
};
export {
  DeleteOrganizationService,
  updateOrganizationService,
  addNewOrganizationService,
  addNewHealthNetworkService,
  updateHealthNetworkService,
  addNewHealthNetworksService,
};
