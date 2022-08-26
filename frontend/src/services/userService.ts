import { toast } from "react-toastify";

import { timeOut } from "@src/helpers/utils/constants";

const addNewUserService = async (id, userObject, addNewUser) => {
  await addNewUser({
    id: id?.toString(),
    organizationUpsertUser: userObject,
  })
    .unwrap()
    .then(async () => {
      toast.success("New User Added.", {
        autoClose: timeOut,
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
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};

const deactivateUserService = async (id, userDeactivateMutation) => {
  await userDeactivateMutation({
    userEnableDisable: {
      users: [id],
    },
  }).unwrap();
};

const activateUserService = async (id, userActivateMutation) => {
  await userActivateMutation({
    userEnableDisable: {
      users: [id],
    },
  }).unwrap();
};

const updateUsernameService = async (userObj, updateUsername) => {
  await updateUsername({
    meUpdate: {
      first_name: userObj?.first_name,
      last_name: userObj?.last_name,
      meta: {
        profile_picture: userObj?.meta?.profile_picture,
        title: userObj?.meta?.title,
      },
    },
  }).unwrap();
};

export {
  addNewUserService,
  updateUserService,
  deactivateUserService,
  activateUserService,
  updateUsernameService,
};
