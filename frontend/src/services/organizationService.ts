import { toast } from "react-toastify";

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
      toast.success("Organization Updated.", {
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
      toast.success("HealthNetwork Updated.", {
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
      toast.success("New HealthNetwork Added.", {
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
    .catch(() => {
      toast.success("HealthNetworks Add Failed", {
        autoClose: 1000,
        pauseOnHover: false,
      });
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
