import { toast } from "react-toastify";

const addNewOrdanizationSystem = async (
    organizationId,
    systemObject,
    addOrganizationSystem,
    refetch,
    setErrors,
    resetModal
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
        });
        resetModal();
        refetch();
      })
      .catch((err) => {
        console.log(err.status)
        if(err?.status === 400){
           setErrors(err.data)
        }
      });
  };

  export { addNewOrdanizationSystem };