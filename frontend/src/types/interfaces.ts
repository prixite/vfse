import {
  Modality,
  Organization,
  Role,
  Site,
  System,
  User,
} from "@src/store/reducers/generated";

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
  role: string;
  manager: string;
  customer: string;
  selectedModalities: Array<Modality>;
  selectedSites: Array<Site>;
  selectedSystems: Array<System>;
  docLink: boolean;
  possibilitytoLeave: boolean;
  accessToFSEFunctions: boolean;
  viewOnly: boolean;
  auditEnable: boolean;
  oneTimeLinkCreation: boolean;
}
