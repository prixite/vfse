const deactivateUserService = async (id, userDeactivateMutation, refetch) => {
  await userDeactivateMutation({
    userEnableDisable: {
      users: [id],
    },
  }).unwrap();
  refetch();
};

const activateUserService = async (id, userActivateMutation, refetch) => {
  await userActivateMutation({
    userEnableDisable: {
      users: [id],
    },
  }).unwrap();
  refetch();
};

export { deactivateUserService, activateUserService };
