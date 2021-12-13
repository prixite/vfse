import { toast } from "react-toastify";

const updateOrganizationColor = async (
  organizationsPartialUpdate,
  organizationData
) => {
  await organizationsPartialUpdate({
    id: organizationData.id.toString(),
    organization: organizationData,
  }).unwrap();
  toast.success("Current organization theme successfully updated.");
};

export { updateOrganizationColor };
