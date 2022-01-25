import { toast } from "react-toastify";

const addNewUserService = async (id, userObject, addNewUser, refetch) => {
  await addNewUser({
    id: id?.toString(),
    organizationUpsertUser: userObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("New User Added.", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: refetch,
      });
    })
    .catch(() => {
      toast.error("Adding user failed.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
};

export { addNewUserService };
