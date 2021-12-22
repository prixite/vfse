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
  await updateOrganization({ id, organization }).unwrap();
  refetch();
};
const addNewOrganizationService = async (
  organization,
  addNewOrganization,
  refetch
) => {
  await addNewOrganization({
    organization: organization,
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};
export {
  updateOrganizationColor,
  DeleteOrganizationService,
  updateOrganizationService,
  addNewOrganizationService,
};
