import { toast } from "react-toastify";

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

const toastAPIError = (
  message: string,
  status: number | null,
  data: unknown
) => {
  if (status < 500)
    toast.error(data[Object.keys(data)[0]][0], {
      autoClose: 1000,
      pauseOnHover: false,
    });
  else
    toast.error(message, {
      autoClose: 1000,
      pauseOnHover: false,
    });
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
};
