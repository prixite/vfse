import { toast } from "react-toastify";

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
        autoClose: 1000,
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
        autoClose: 1000,
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
        autoClose: 1000,
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
        autoClose: 1000,
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
      toast.success("HealthNetwork Successfully Added", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    })
    .catch((error) => {
      toastAPIError(`${error.data[0]}`, err?.status, err?.data);
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
