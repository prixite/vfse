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
      toast.error(err?.data?.non_field_errors[0], {
        autoClose: timeOut,
        pauseOnHover: true,
      });
    });
};

export {
  addNewUserService,
  updateUserService,
  deactivateUserService,
  activateUserService,
  updateUserPassword,
};
