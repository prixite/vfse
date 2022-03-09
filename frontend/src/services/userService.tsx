import { toast } from "react-toastify";

const addNewUserService = async (id, userObject, addNewUser) => {
  await addNewUser({
    id: id?.toString(),
    organizationUpsertUser: userObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("New User Added.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
};

const updateUserService = async (id, userObject, updateUser) => {
  await updateUser({
    id: id?.toString(),
    upsertUser: userObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("User updated successfully.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
};

const deactivateUserService = async (id, userDeactivateMutation, refetch) => {
  await userDeactivateMutation({
    userEnableDisable: {
      users: [id],
    },
  })
    .unwrap()
    .then(async () => {
      refetch();
    });
};

const activateUserService = async (id, userActivateMutation, refetch) => {
  await userActivateMutation({
    userEnableDisable: {
      users: [id],
    },
  })
    .unwrap()
    .then(async () => {
      refetch();
    });
};

export {
  addNewUserService,
  updateUserService,
  deactivateUserService,
  activateUserService,
};
