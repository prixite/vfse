import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import { Buffer } from "buffer";
import { useFormik } from "formik";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import PageOne from "@src/components/shared/popUps/userModal/PageOne";
import PageTwo from "@src/components/shared/popUps/userModal/PageTwo";
import useUserSite from "@src/components/shared/popUps/userModal/useUserSites";
import "@src/components/shared/popUps/userModal/userModal.scss";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  populateUserModalEditableData,
  toastAPIError,
  userFormInitialState,
  userFormValidationSchema,
} from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
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
import { UserForm, UserModalProps } from "@src/types/interfaces";
// eslint-disable-next-line
const phoneReg = /^(\+1)[0-9]{10}$/;

window.Buffer = window.Buffer || Buffer;

export default function UserModal(props: UserModalProps) {
  const [page, setPage] = useState("1");
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState("");
  const { toastData } = constantsData;
  const constantData = localizedData()?.users?.popUp;
  const {
    addNewUser,
    pageTrackerdesc1,
    pageTrackerdesc2,
    btnCancel,
    btnNext,
    btnAddUser,
    btnToSave,
    addText,
    manager,
    customer,
    role,
    edit,
    userProfileImage,
    userProfileImageText,
    editUserText,
  } = constantData;

  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const formik = useFormik<UserForm>({
    initialValues: userFormInitialState,
    validationSchema: userFormValidationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (props?.action === addText) {
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
  const editedUser = props?.usersData?.find((user) => {
    return user?.id == props?.selectedUser;
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

  useEffect(() => {
    if (props?.action == addText) {
      if (usersData?.length) {
        formik.setFieldValue(manager, usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue(customer, props?.organizationData[0]?.id);
      }
      if (props?.roles?.length) {
        formik.setFieldValue(role, props?.roles[0].value);
      }
    }
  }, []);

  useEffect(() => {
    if (props?.selectedUser && props?.action == edit) {
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
    if (selectedImage?.length) {
      formik.setFieldValue(userProfileImage, selectedImage[0]);
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
          const userObject = getUserObject(data?.location);
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
              toastAPIError(toastData.userAlreadyExists, err.status, err.data);
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
            performEditUser(data?.location);
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
      },
      first_name: formik.values.firstname,
      last_name: formik.values.lastname,
      email: formik.values.email,
      phone: `+1${formik.values.phone}`,
      role: formik.values.role,
      organization: formik.values.customer,
      sites: formik.values.selectedSites,
      systems: formik.values.selectedSystems,
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
    const userObject = constructObject(data, userProfileImageText);
    await updateUserService(props?.selectedUser, userObject, updateUser)
      .then(() => {
        setTimeout(() => {
          resetModal();
          setIsLoading(false);
        }, 500);
      })
      .catch((error) => {
        toastAPIError(toastData.saveUserError, error.status, error.data);
        setIsLoading(false);
      });
  };

  const getUserObject = (imageUrl: string) => {
    return {
      memberships: [constructObject(imageUrl, userProfileImageText)],
    };
  };

  const resetModal = () => {
    if (props?.action == addText) {
      formik.resetForm();
      formik.setFieldValue(userProfileImage, selectedImage[0]);
      if (usersData?.length) {
        formik.setFieldValue(manager, usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue(customer, props?.organizationData[0]?.id);
      }
    } else if (props?.action == edit) {
      populateUserModalEditableData(
        editedUser,
        formik,
        usersData,
        userSitesMap,
        props?.organizationData,
        props?.modalitiesList
      );
      formik.resetForm();
      formik.setFieldValue(userProfileImage, selectedImage[0]);
    }
    props?.handleClose();
  };

  const moveToNextPage = async () => {
    const phoneValue = `+1${formik.values.phone}`;
    const errors = await formik.validateForm();
    if (!Object.keys(errors).length && phoneValue.match(phoneReg)) {
      setPage("2");
      setIsPhoneError("");
    } else {
      setIsPhoneError(constantsData.users.popUp.invalidPhoneFormat);
      setOnChangeValidation(true);
    }
  };

  return (
    <Dialog className="users-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {!props?.selectedUser ? addNewUser : editUserText}
          </span>
          <span className="dialog-page">
            <span className="pg-number">
              {`${pageTrackerdesc1} ${page} ${pageTrackerdesc2}`}
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
            <PageTwo formik={formik} modalitiesList={props.modalitiesList} />
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
          {btnCancel}
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
            {btnNext}
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
            {props?.action == "add" ? btnAddUser : btnToSave}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
