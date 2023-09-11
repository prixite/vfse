import { FormikErrors } from "formik";

import {
  Modality,
  Organization,
  Role,
  User,
} from "@src/store/reducers/generatedWrapper";

export enum UserRole {
  FSE_ADMIN = "fse-admin",
  CUSTOMER_ADMIN = "customer-admin",
  USER_ADMIN = "user-admin",
  FSE = "fse",
  END_USER = "end-user",
  VIEW_ONLY = "view-only",
  ONE_TIME = "one-time",
  CRYO = "cryo",
  CRYO_FSE = "cryo-fse",
  CRYO_ADMIN = "cryo-admin",
}

export interface ApiError {
  status: number;
  data: Record<string, Array<string>>;
}

export interface ChatBotResponse {
  response_text: string;
}
export interface getTopicListArg {
  followed?: boolean;
  created?: boolean;
  page?: number;
}
//we also need system name and image in workOrderApi Response
export interface WorkOrderResponse {
  id: number;
  system: number;
  description: string;
  work_started?: boolean;
  work_completed?: boolean;
}

export interface UserModalProps {
  open: boolean;
  handleClose: () => void;
  selectedUser?: number;
  usersData?: Array<User>;
  roles: Role[];
  organizationData?: Array<Organization>;
  modalitiesList?: Array<Modality>;
  action: string;
}

export interface UserForm {
  userProfileImage: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role:
    | "fse-admin"
    | "customer-admin"
    | "user-admin"
    | "fse"
    | "end-user"
    | "cryo"
    | "cryo-fse"
    | "cryo-admin";
  manager: number;
  customer: number;
  selectedModalities: Array<number>;
  selectedSites: Array<number>;
  selectedSystems: Array<number>;
  docLink: boolean;
  possibilitytoLeave: boolean;
  accessToFSEFunctions: boolean;
  viewOnly: boolean;
  auditEnable: boolean;
  oneTimeLinkCreation: boolean;
}

export interface Formik {
  initialValues: UserForm;
  initialStatus: UserForm;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  handleChange: (e: React.ChangeEvent<any>) => void;
  values: UserForm;
  errors?: FormikErrors<UserForm>;
  setFieldValue: (
    field: string,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<UserForm>> | Promise<void>;
  submitCount: number;
}

export type Router = {
  account: string;
  actual_firmware: string;
  asset_id: null | number;
  config_status: string;
  configuration_manager: string;
  created_at: string;
  custom1: unknown;
  custom2: unknown;
  description: string;
  device_type: string;
  full_product_name: string;
  group: string;
  id: string;
  ipv4_address: string;
  lans: string;
  last_known_location: string;
  locality: string;
  mac: string;
  name: string;
  overlay_network_binding: string;
  product: string;
  reboot_required: false;
  resource_url: string;
  serial_number: string;
  state: string;
  state_updated_at: string;
  target_firmware: string;
  updated_at: string;
  upgrade_pending: false;
};

export type SystemLocation = {
  system: number;
  name: string;
  lat: string;
  long: string;
};
