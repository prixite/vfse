import { toast } from "react-toastify";

const addNewOrdanizationSystem = async (
  organizationId,
  systemObject,
  addOrganizationSystem,
  refetch,
  setErrors,
  handleClear,
  setDisableButton,
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
        onClose : () => {
          handleClear();
          setDisableButton(false);
          refetch();
        }
      });
    })
    .catch((err) => {
      setDisableButton(false);
      if (err?.status === 400) {
        setErrors(err.data);
      }
    });
};

export { addNewOrdanizationSystem };
