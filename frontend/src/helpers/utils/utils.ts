import { toast } from "react-toastify";
import * as yup from "yup";

import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import { Organization } from "@src/store/reducers/generated";
import { ApiError, UserForm } from "@src/types/interfaces";
const constantUserData = localizedData()?.users?.popUp;

const validateIPaddress = (ipaddress: string) => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      // eslint-disable-line
      ipaddress
    )
  ) {
    return true;
  }
  return false;
};

const returnPayloadThemeObject = (org: Organization) => {
  return {
    sideBarBackground: org.appearance.sidebar_color,
    buttonBackground: org.appearance.primary_color,
    sideBarTextColor: org.appearance.sidebar_text,
    buttonTextColor: org.appearance.button_text,
    secondaryColor: org.appearance.secondary_color,
    fontOne: org.appearance.font_one,
    fontTwo: org.appearance.font_two,
  };
};

const returnSearchedOject = (data, key) => {
  const list = data.filter((item) => item.id == key);
  return list;
};

const hexToRgb = (hex, opacity) => {
  const red = parseInt(hex[1] + hex[2], 16);
  const green = parseInt(hex[3] + hex[4], 16);
  const blue = parseInt(hex[5] + hex[6], 16);

  return `rgba(${red},${green},${blue},${opacity})`;
};

const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && "status" in error;
};

const isBadRequestError = (error: ApiError): boolean => {
  return isApiError(error) && error.status === 400;
};

const getNonFieldError = (error: unknown) => {
  if (isApiError(error)) {
    if (isBadRequestError(error) && "non_field_errors" in error.data) {
      return error.data.non_field_errors[0];
    }
  }
};

const isNonFieldError = (error: unknown): boolean => {
  if (isApiError(error)) {
    return isBadRequestError(error) && "non_field_errors" in error.data;
  }
  return false;
};

function iterateDeepObj(obj: unknown) {
  if (typeof obj === "string") {
    return obj;
  }
  if (obj[Object.keys(obj)[0]]) {
    return iterateDeepObj(obj[Object.keys(obj)[0]]);
  }
  return obj;
}

const toastAPIError = (message: string, status?: number, data?: unknown) => {
  switch (status) {
    case 400: {
      // For const dummyTwo = { membership: [ { phone: ['text2'] } ] }
      // For const dummyOne = { phone: ['text1'] }
      const errorToPrint = iterateDeepObj(data);
      if (errorToPrint) {
        toast.error(errorToPrint, {
          autoClose: 3000,
          pauseOnHover: false,
        });
      } else {
        toast.error(
          `${status} The server was unable to understand the request`,
          {
            autoClose: 3000,
            pauseOnHover: false,
          }
        );
      }
      break;
    }

    case 401: {
      toast.error(`${status} Unauthorized Request`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;
    }

    case 403: {
      toast.error(
        `Forbidden Request: Execution of access to this resource is forbidden.`,
        {
          autoClose: 3000,
          pauseOnHover: false,
        }
      );
      break;
    }

    case 404: {
      toast.error(`${status} Requested resoure not found`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;
    }

    default: {
      toast.error(message, {
        autoClose: 3000,
        pauseOnHover: false,
      });
    }
  }
};

const nameReg = /^[A-Za-z ]*$/;
// eslint-disable-next-line
const emailRegX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

const userFormValidationSchema = yup.object({
  userProfileImage: yup
    .string()
    .required(constantsData.users.popUp.imageRequired),
  firstname: yup
    .string()
    .matches(nameReg)
    .required(constantsData.users.popUp.firstNameRequired),
  lastname: yup
    .string()
    .matches(nameReg)
    .required(constantsData.users.popUp.lastNameRequired),
  email: yup
    .string()
    .matches(emailRegX, constantsData.users.popUp.invalidEmailText) //TODO
    .required(constantsData.users.popUp.emailRequired),
});

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
      formik.setFieldValue(
        constantUserData.phone,
        editedUser?.phone?.substring(2)
      );
    }
    if (editedUser?.role?.length) {
      formik.setFieldValue(constantUserData.role, editedUser.role[0]);
    }
    if (editedUser?.manager) {
      formik.setFieldValue(
        constantUserData.manager,
        usersData?.filter(
          (user) => user?.email == editedUser?.manager?.email
        )[0]?.id
      );
    } else {
      if (usersData?.length) {
        formik.setFieldValue(constantUserData.manager, usersData[0]?.id);
      }
    }
    if (editedUser?.organizations?.length) {
      formik.setFieldValue(
        constantUserData.customer,
        organizationData?.filter((org) => {
          return (
            org?.name?.toString() == editedUser?.organizations[0]?.toString()
          );
        })[0]?.id
      );
    }
    if (editedUser?.sites) {
      formik.setFieldValue(constantUserData.selectedSites, [
        ...userSitesMap.keys(),
      ]);
    }

    if (editedUser?.systems?.length) {
      const system_ids: Array<number> = [];
      editedUser?.systems?.forEach((system) => {
        system_ids.push(system);
      });
      formik.setFieldValue("selectedSystems", system_ids);
    }

    if (editedUser?.modalities?.length) {
      const filterModalities = modalitiesList?.filter((modality) => {
        return editedUser?.modalities?.includes(modality?.name?.toString());
      });
      const mod_ids: Array<number> = [];
      filterModalities?.forEach((mod) => {
        mod_ids.push(mod?.id);
      });
      formik.setFieldValue(constantUserData.selectedModalities, mod_ids);
    }
    if (editedUser?.fse_accessible) {
      formik.setFieldValue(
        constantUserData.accessToFSEFunctions,
        editedUser?.fse_accessible
      );
    }
    if (editedUser?.audit_enabled) {
      formik.setFieldValue(
        constantUserData.auditEnable,
        editedUser?.audit_enabled
      );
    }
    if (editedUser?.can_leave_notes) {
      formik.setFieldValue(
        constantUserData.possibilitytoLeave,
        editedUser?.can_leave_notes
      );
    }
    if (editedUser?.view_only) {
      formik.setFieldValue(constantUserData.viewOnly, editedUser?.view_only);
    }
    if (editedUser?.is_one_time) {
      formik.setFieldValue(
        constantUserData.oneTimeLinkCreation,
        editedUser?.is_one_time
      );
    }
    if (editedUser?.documentation_url) {
      formik.setFieldValue(
        constantUserData.docLink,
        editedUser?.documentation_url
      );
    }
  }
};

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

export {
  toastAPIError,
  validateIPaddress,
  returnSearchedOject,
  hexToRgb,
  isApiError,
  isBadRequestError,
  getNonFieldError,
  isNonFieldError,
  returnPayloadThemeObject,
  userFormValidationSchema,
  userFormInitialState,
  populateUserModalEditableData,
};
