import { toast } from "react-toastify";

import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";

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
const updateUserPassword = async (passwordObj, updateUserPassword) => {
  await updateUserPassword({
    upsertUserPassword: {
      password: passwordObj?.password,
      old_password: passwordObj?.old_password,
    },
  })
    .unwrap()
    .then(async () => {
      toast.success("Password updated successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    })
    .catch((err) => {
      toastAPIError(
        "Unable to update password successfully.",
        err.originalStatus
      );
    });
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
  updateUserPassword,
  updateUsernameService,
};
