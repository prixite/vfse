import { toast } from "react-toastify";

const updateOrganizationColor = async (
  organizationsPartialUpdate,
  organizationData,
  refetchOrgList
) => {
  await organizationsPartialUpdate({
    id: organizationData.id.toString(),
    organization: organizationData,
  }).unwrap();
  await toast.success("Current organization theme successfully updated.", {
    autoClose: 1000,
    pauseOnHover: false,
    onClose: refetchOrgList,
  });
};
const DeleteOrganizationService = async (id, deleteOrganization, refetch) => {
  await deleteOrganization({
    id: id.toString(),
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};
const updateOrganizationService = async (
  id,
  organization,
  updateOrganization,
  refetch
) => {
  await updateOrganization({ id, organization })
    .unwrap()
    .then(async () => {
      toast.success("Organization Updated.", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: refetch,
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
      toast.success("Organization Updated.", {
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
  sites,
  refetch
) => {
  await updateOrganization({ id, organization })
    .unwrap()
    .then(async (response) => {
      toast.success("Organization Updated.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
      await updateOrganizationSites({
        id: response?.id,
        organizationSite: { sites: [...sites] },
      }).unwrap();
      refetch();
    });
};

const addNewHealthNetworkService = async (
  id,
  organization,
  addHealthNetwork,
  updateOrganizationSites,
  sites,
  refetch
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
      refetch();
    });
};

const addNewHealthNetworksService = async (
  organizationId,
  addNewNetworks,
  networks,
  refetchNetworksList
) => {
  await addNewNetworks({
    id: organizationId,
    organizationHealthNetwork: { health_networks: [...networks] },
  })
    .unwrap()
    .then(() => {
      refetchNetworksList();
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
  updateOrganizationColor,
  DeleteOrganizationService,
  updateOrganizationService,
  addNewOrganizationService,
  addNewHealthNetworkService,
  updateHealthNetworkService,
  addNewHealthNetworksService,
};
