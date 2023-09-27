import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import PageOne from "@src/components/shared/popUps/userModal/PageOne";
import PageTwo from "@src/components/shared/popUps/userModal/PageTwo";
import useUserSite from "@src/components/shared/popUps/userModal/useUserSites";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import {
  toastAPIError,
  emailRegX,
  nameReg,
  phoneReg,
} from "@src/helpers/utils/utils";
import {
  addNewUserService,
  updateUserService,
} from "@src/services/userService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
  useUsersPartialUpdateMutation,
  useScopeUsersCreateMutation,
  UpsertUser,
} from "@src/store/reducers/api";
import { S3Interface, UserForm, UserModalProps } from "@src/types/interfaces";

import "@src/components/shared/popUps/userModal/userModal.scss";
// eslint-disable-next-line

window.Buffer = window.Buffer || Buffer;

const userFormInitialState: UserForm = {
  userProfileImage: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  role: "",
  manager: undefined,
  customer: undefined,
  selectedModalities: [],
  selectedSites: [],
  selectedSystems: [],
  docLink: false,
  possibilitytoLeave: false,
  accessToFSEFunctions: false,
  viewOnly: false,
  auditEnable: false,
  oneTimeLinkCreation: false,
};

const userFormValidationSchema = yup.object({
  userProfileImage: yup.string().required("Image is required!"),
  firstname: yup.string().matches(nameReg).required("First name is required!"),
  lastname: yup.string().matches(nameReg).required("Last name is required!"),
  email: yup
    .string()
    .matches(emailRegX, "Invalid E-mail!") //TODO
    .required("Email is required!"),
});

export default function UserModal(props: UserModalProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState("1");
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState("");

  const [systemStatus, setSystemStatus] = useState(new Map());

  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const formik = useFormik<UserForm>({
    initialValues: userFormInitialState,
    validationSchema: userFormValidationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (props.action === "add") {
        handleAddUser();
      } else {
        handleEditUser();
      }
    },
  });

  const { data: networksData } = useOrganizationsHealthNetworksListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const { data: organizationSitesData } = useOrganizationsSitesListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const editedUser = props?.usersData.find((user) => {
    return user.id == props?.selectedUser;
  });

  const userSitesMap = useUserSite({
    networksData,
    organizationSitesData,
    userSites: editedUser?.sites,
  });

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [createUser] = useScopeUsersCreateMutation();
  const [updateUser] = useUsersPartialUpdateMutation();

  const selectedOrganization = useSelectedOrganization();

  const { usersData } = props;

  const populateUserModalEditableData = (
    editedUser,
    formik,
    usersData,
    userSitesMap,
    organizationData,
    modalitiesList
  ) => {
    if (editedUser?.image?.length) {
      formik.setValues({
        ...formik.values,
        userProfileImage: editedUser?.image,
        firstname: editedUser?.first_name,
        lastname: editedUser?.last_name,
        email: editedUser?.email,
      });
      if (editedUser?.phone?.length && editedUser?.phone?.indexOf("+1") > -1) {
        formik.setFieldValue("phone", editedUser?.phone?.substring(2));
      }
      if (editedUser?.role?.length) {
        formik.setFieldValue("role", editedUser.role[0]);
      }
      if (editedUser?.manager) {
        formik.setFieldValue(
          "manager",
          usersData?.filter(
            (user) => user?.email == editedUser?.manager?.email
          )[0]?.id
        );
      } else {
        if (usersData?.length) {
          formik.setFieldValue("manager", usersData[0]?.id);
        }
      }
      if (editedUser?.organizations?.length) {
        formik.setFieldValue(
          "customer",
          organizationData?.filter((org) => {
            return (
              org?.name?.toString() == editedUser?.organizations[0]?.toString()
            );
          })[0]?.id
        );
      }
      if (editedUser?.sites) {
        formik.setFieldValue("selectedSites", [...userSitesMap.keys()]);
      }

      if (editedUser?.systems?.length) {
        const system_ids: Array<number> = [];
        const tempStatusMap = new Map();
        editedUser?.systems?.forEach((system) => {
          tempStatusMap.set(system.system, system);
          system_ids.push(system.system);
        });
        setSystemStatus(tempStatusMap);
        formik.setFieldValue("selectedSystems", system_ids);
      }

      if (editedUser?.modalities?.length) {
        const filterModalities = modalitiesList.filter((modality) => {
          return editedUser?.modalities.includes(modality.name?.toString());
        });
        const mod_ids: Array<number> = [];
        filterModalities?.forEach((mod) => {
          mod_ids.push(mod.id);
        });
        formik.setFieldValue("selectedModalities", mod_ids);
      }
      if (editedUser?.fse_accessible) {
        formik.setFieldValue(
          "accessToFSEFunctions",
          editedUser?.fse_accessible
        );
      }
      if (editedUser?.audit_enabled) {
        formik.setFieldValue("auditEnable", editedUser?.audit_enabled);
      }
      if (editedUser?.can_leave_notes) {
        formik.setFieldValue("possibilitytoLeave", editedUser?.can_leave_notes);
      }
      if (editedUser?.view_only) {
        formik.setFieldValue("viewOnly", editedUser?.view_only);
      }
      if (editedUser?.is_one_time) {
        formik.setFieldValue("oneTimeLinkCreation", editedUser?.is_one_time);
      }
      if (editedUser?.documentation_url) {
        formik.setFieldValue("docLink", editedUser?.documentation_url);
      }
    }
  };

  useEffect(() => {
    if (props.action == "add") {
      if (usersData.length) {
        formik.setFieldValue("manager", usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue("customer", props?.organizationData[0]?.id);
      }
      if (props.roles.length) {
        formik.setFieldValue("role", props.roles[0].value);
      }
    }
  }, []);

  useEffect(() => {
    if (props?.selectedUser && props.action == "edit") {
      populateUserModalEditableData(
        editedUser,
        formik,
        usersData,
        userSitesMap,
        props?.organizationData,
        props?.modalitiesList
      );
    }
  }, [props?.selectedUser, networksData, organizationSitesData]);

  useEffect(() => {
    if (selectedImage.length) {
      formik.setFieldValue("userProfileImage", selectedImage[0]);
    }
  }, [selectedImage]);

  const handleChange = (event) => {
    if (page == "1") {
      moveToNextPage();
    } else {
      setPage(event.target.value);
    }
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    if (formik.isValid) {
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          const userObject = getUserObject(data.location);
          await addNewUserService(
            selectedOrganization.id,
            userObject,
            createUser
          )
            .then(() => {
              setTimeout(() => {
                resetModal();
                setIsLoading(false);
              }, 500);
            })
            .catch((err) => {
              toastAPIError(
                "User with this username already exists.",
                err.status,
                err.data
              );
              setIsLoading(false);
            });
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    setIsLoading(true);
    if (formik.isValid) {
      if (!selectedImage.length && formik.values.userProfileImage?.length) {
        performEditUser(formik.values.userProfileImage);
      } else {
        await uploadImageToS3(selectedImage[0]).then(
          async (data: S3Interface) => {
            performEditUser(data.location);
          }
        );
      }
    } else {
      setIsLoading(false);
    }
  };

  const constructObject = (
    imageUrl: string,
    userProfileImageText: string
  ): UpsertUser => {
    const obj = {
      meta: {
        profile_picture: imageUrl,
        title: userProfileImageText,
        location: editedUser?.location || "",
        slack_link: editedUser?.slack_link || "",
        calender_link: editedUser?.calender_link || "",
        zoom_link: editedUser?.zoom_link || "",
      },
      first_name: formik.values.firstname,
      last_name: formik.values.lastname,
      email: formik.values.email,
      phone: `+1${formik.values.phone}`,
      role: formik.values.role,
      organization: formik.values.customer,
      sites: formik.values.selectedSites,
      systems: formik.values.selectedSystems.map((system) => ({
        system,
        is_read_only: systemStatus.get(system)?.is_read_only ?? false,
      })),
      modalities: formik.values.selectedModalities,
      fse_accessible: formik.values.accessToFSEFunctions,
      audit_enabled: formik.values.auditEnable,
      can_leave_notes: formik.values.possibilitytoLeave,
      view_only: formik.values.viewOnly,
      is_one_time: formik.values.oneTimeLinkCreation,
      documentation_url: formik.values.docLink,
      manager: formik.values.manager,
    };
    return obj;
  };

  const performEditUser = async (data: string) => {
    const userObject = constructObject(data, "User Profile Image");
    await updateUserService(props?.selectedUser, userObject, updateUser)
      .then(() => {
        setTimeout(() => {
          resetModal();
          setIsLoading(false);
        }, 500);
      })
      .catch((error) => {
        toastAPIError(
          "Error occurred while saving user",
          error.status,
          error.data
        );
        setIsLoading(false);
      });
  };

  const getUserObject = (imageUrl: string) => {
    return {
      memberships: [constructObject(imageUrl, "User Profile Image")],
    };
  };

  const resetModal = () => {
    if (props.action == "add") {
      formik.resetForm();
      formik.setFieldValue("userProfileImage", selectedImage[0]);
      if (usersData.length) {
        formik.setFieldValue("manager", usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue("customer", props?.organizationData[0]?.id);
      }
    } else if (props.action == "edit") {
      populateUserModalEditableData(
        editedUser,
        formik,
        usersData,
        userSitesMap,
        props?.organizationData,
        props?.modalitiesList
      );
      formik.resetForm();
      formik.setFieldValue("userProfileImage", selectedImage[0]);
    }
    props.handleClose();
  };

  // const moveToNextPage = async () => {
  //   const phoneValue = `+1${formik.values.phone}`;
  //   const errors = await formik.validateForm();
  //   if (phoneValue.match(phoneReg)) {
  //     setPage("2");
  //     setIsPhoneError("correct");
  //   } else {
  //     setIsPhoneError("Invalid Phone Format");
  //     setOnChangeValidation(true);
  //   }
  // };

  const moveToNextPage = async () => {
    const phoneValue = `+1${formik.values.phone}`;
    const errors = await formik.validateForm();
    if (phoneValue.match(phoneReg)) {
      setIsPhoneError("");
      if (Object.keys(errors).length === 0) {
        setPage("2");
      }
    } else {
      setIsPhoneError("Invalid Phone Format");
      setOnChangeValidation(true);
    }
  };

  return (
    <Dialog className="users-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {!props?.selectedUser ? "Add User" : "Edit User"}
          </span>
          <span className="dialog-page">
            <span className="pg-number">
              {`${"Step"} ${page} ${"of 2"}`}
              <span style={{ marginLeft: "16px" }}>
                <Radio
                  checked={page === "1"}
                  onChange={handleChange}
                  value="1"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "1" }}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: buttonBackground,
                    },
                  }}
                />
                <Radio
                  checked={page === "2"}
                  onChange={handleChange}
                  value="2"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "2" }}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: buttonBackground,
                    },
                  }}
                />
              </span>
            </span>
            <img
              src={CloseBtn}
              className="cross-btn"
              onClick={resetModal}
              alt=""
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <PageOne
              formik={formik}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              roles={props.roles}
              isPhoneError={isPhoneError}
              organizationData={props.organizationData}
              action={props.action}
            />
          ) : (
            <PageTwo
              formik={formik}
              modalitiesList={props.modalitiesList}
              systemStatus={systemStatus}
              setSystemStatus={setSystemStatus}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions
        style={{
          padding: "20px 24px",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: secondaryColor,
                  color: buttonTextColor,
                }
          }
          onClick={resetModal}
          disabled={isLoading}
          className="cancel-btn"
        >
          {t("Cancel")}
        </Button>

        {page === "1" ? (
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            onClick={moveToNextPage}
            className="add-btn"
          >
            {t("Next")}
          </Button>
        ) : (
          <Button
            style={
              isLoading
                ? {
                    backgroundColor: "lightgray",
                    color: buttonTextColor,
                  }
                : {
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }
            }
            disabled={isLoading}
            onClick={() => formik.handleSubmit()}
            className="add-btn"
          >
            {props.action == "add" ? "Add User" : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
