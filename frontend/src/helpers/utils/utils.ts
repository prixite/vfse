import { toast } from "react-toastify";

import { Organization } from "@src/store/reducers/generated";
import { ApiError } from "@src/types/interfaces";

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

const toastAPIError = (message: string, status?: number, data?: unknown) => {
  switch (true) {
    case status === 400:
      toast.error(`${status} The server was unable to understand the request`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;
    case status === 401:
      toast.error(`${status} Unauthorized Request`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 403:
      if (data?.detail && data.detail.length) {
        toast.error(`${data.detail}`);
      } else {
        toast.error(
          `Forbidden Request: Execution of access to this resource is forbidden.`,
          {
            autoClose: 3000,
            pauseOnHover: false,
          }
        );
      }
      break;

    case status === 404:
      toast.error(`${status} Requested resoure not found`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 405:
      toast.error(`${status} This method of request is not allowed`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 406:
      toast.error(`${status} Not acceptable`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 407:
      toast.error(`${status} Proxy Authentication Required`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 412:
      toast.error(`${status} Prerequisites Failed`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status === 414:
      toast.error(`${status} Request-uri too long`, {
        autoClose: 3000,
        pauseOnHover: false,
      });
      break;

    case status < 500: {
      const errorPrint = data[Object.keys(data)[0]][0]; //referentially equal
      if (
        errorPrint &&
        errorPrint.length !== 0 &&
        errorPrint !== "" &&
        Object.keys(errorPrint).length !== 0 && // FalsyObject check
        !Array.isArray(errorPrint) // Array Type
      ) {
        toast.error(`${data[Object.keys(data)[0]][0]}`, {
          autoClose: 3000,
          pauseOnHover: false,
        });
      } else {
        toast.error(`Ran 2 ${message}`, {
          autoClose: 3000,
          pauseOnHover: false,
        });
      }
      break;
    }

    default:
      toast.error(message, {
        autoClose: 3000,
        pauseOnHover: false,
      });
  }
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
};
