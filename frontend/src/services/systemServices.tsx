import { toast } from "react-toastify";

const addNewOrdanizationSystem = async (
  organizationId,
  systemObject,
  addOrganizationSystem,
  refetch,
  setErrors,
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
    .catch((err) => {
      setDisableButton(false);
      if (err?.status === 400) {
        setErrors(err.data);
      }
    });
};

const updateOrdanizationSystem = async (
  organizationId,
  id,
  system,
  updateSystem,
  refetch,
  setErrors,
  handleClear,
  setDisableButton
) => {
  const OrganizationsSystemsPartialUpdateApiArg = {
    id: organizationId,
    systemPk: id,
    system: system
  }
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
  .catch((err) => {
    setDisableButton(false);
    if (err?.status === 400) {
      setErrors(err.data);
    }
  });
};

const DeleteOrganizationSystemService = async ( organizationId, systemId, deleteSystemsOrganization, refetch) => {
  const OrganizationsSystemsDeleteApiArg ={
    id: organizationId,
    systemPk: systemId
  }
  await deleteSystemsOrganization({
    OrganizationsSystemsDeleteApiArg
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};

export { addNewOrdanizationSystem, updateOrdanizationSystem, DeleteOrganizationSystemService };
