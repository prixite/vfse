import { toast } from "react-toastify";

const addNewOrdanizationSystem = async (
  organizationId,
  systemObject,
  addOrganizationSystem,
  refetch,
  handleClear,
  setDisableButton
) => {
  await addOrganizationSystem({
    id: organizationId,
    system: systemObject,
  })
    .unwrap()
    .then(() => {
      toast.success("System Successfully Added", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
          refetch();
        },
      });
    })
};

const updateOrdanizationSystem = async (
  organizationId,
  id,
  system,
  updateSystem,
  refetch,
  handleClear,
  setDisableButton
) => {
  const OrganizationsSystemsPartialUpdateApiArg = {
    id: organizationId,
    systemPk: id,
    system: system,
  };
  await updateSystem(OrganizationsSystemsPartialUpdateApiArg)
    .unwrap()
    .then(() => {
      toast.success("System Successfully Updated", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
          refetch();
        },
      });
    })
};

const DeleteOrganizationSystemService = async (
  organizationId,
  systemId,
  deleteSystemsOrganization,
  refetch
) => {
  await deleteSystemsOrganization({
    id: organizationId,
    systemPk: systemId,
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};

export {
  addNewOrdanizationSystem,
  updateOrdanizationSystem,
  DeleteOrganizationSystemService,
};
