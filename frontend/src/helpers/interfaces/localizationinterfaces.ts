export interface SystemModal {
  fieldName: string;
  fieldLocation: string;
  fieldLink: string;
  fieldNumber: string;
  fieldSite: string;
  fieldModal: string;
  fieldIp: string;
  fieldVersion: string;
  fieldAsset: string;
  fieldLocalAE: string;
  fieldRisName: string;
  fieldRisIp: string;
  fieldRisTitle: string;
  fieldRisPort: string;
  fieldRisAE: string;
  fieldDicomName: string;
  fieldDicomIp: string;
  fieldDicomTitle: string;
  fieldDicomPort: string;
  fieldDicomAE: string;
  fieldMRIname: string;
  fieldMRIHelium: string;
  fieldMRIMagnet: string;
  headdingAddInfo: string;
  btnAdd: string;
  btnCancel: string;
}
export interface PopUpInterface {
  userNameText: string;
  emailText: string;
  btnAdd: string;
  btnCancel: string;
  btnNext: string;
  btnClient: string;
  addNewUser: string;
  pageTrackerdesc1: string;
  pageTrackerdesc2: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhoneNumber: string;
  userRole: string;
  userManager: string;
  userCustomer: string;
  newUser: string;
}

export interface UsersInterface {
  addUser: string;
  userAdministration: string;
  btnFilter: string;
  btnAdd: string;
  popUp: PopUpInterface;
}

export interface CardPopUpInterface {
  edit: string;
  delete: string;
}

export interface PopUp2Interface {
  popUpNewNetwork: string;
  newNetworkAddSite: string;
  newNetworkLogo: string;
  newNetworkName: string;
  newNetworkBtnSave: string;
  newNetworkBtnCancel: string;
}

export interface DeleteDialogInterface {
  dialogMessage: string;
  noButton: string;
  yesButton: string;
}

export interface ModalitiesInterface {
  title: string;
  btnFilter: string;
  btnAdd: string;
  noDataTitle: string;
  noDataDescription: string;
  cardPopUp: CardPopUpInterface;
  popUp: PopUp2Interface;
  deleteDialog: DeleteDialogInterface;
}

export interface hisRISInterface {
  ip: string;
  title: string;
  port: number;
  ae_title: string;
}

export interface dicomInfoInterface {
  ip: string;
  title: string;
  port: number;
  ae_title: string;
}

export interface MRIParamInterface {
  helium: string;
  magent_pressure: string;
}

export interface imagePropInterface {
  image: string;
  description: object;
}

export interface SystemInterface {
  name: string;
  image: string;
  software_version: string;
  serial_number: string;
  asset_number: string;
  ip_address: string;
  local_ae_title: string;
  his_ris_info: hisRISInterface;
  dicom_info: dicomInfoInterface;
  mri_embedded_parameters: MRIParamInterface;
  location_in_building: string;
  grafana_link: string;
  documentation: string;
  handleEdit: () => void;
}

export interface PopUp3Interface {
  popUpNewNetwork: string;
  newNetworkAddSite: string;
  newNetworkLogo: string;
  newNetworkName: string;
  newNetworkBtnSave: string;
  newNetworkBtnCancel: string;
}

export interface CardPopUp2Interface {
  editSite: string;
  deleteSite: string;
}

export interface DeleteDialog2Interface {
  dialogMessage: string;
  noButton: string;
  yesButton: string;
}

export interface SitesInterface {
  title: string;
  btnFilter: string;
  btnAdd: string;
  noResultMsg: string;
  noDataTitle: string;
  noDataDescription: string;
  popUp: PopUp3Interface;
  cardPopUp: CardPopUp2Interface;
  deleteDialog: DeleteDialog2Interface;
}

export interface DocumentationInterface {
  title: string;
  btnFilter: string;
  btnCol: string;
  btnAsset: string;
}

export interface PopUp4Interface {
  popUpNewOrganization: string;
  newOrganizationPageTrackerdesc1: string;
  newOrganizationPageTrackerdesc2: string;
  newOrganizationName: string;
  newOrganizationSeats: string;
  newOrganizationBtnNext: string;
  newOrganizationBtnSave: string;
  newOrganizationBtnCancel: string;
  newOrganizationLogo: string;
  newOrganizationColor1: string;
  newOrganizationColor2: string;
  newOrganizationColor3: string;
  newOrganizationColor4: string;
  newOrganizationFont1: string;
  newOrganizationFont2: string;
  newOrganizationHealthNetworks: string;
  newOrganizationAddNetwork: string;
}

export interface DeleteDialog3Interface {
  dialogMessage: string;
  noButton: string;
  yesButton: string;
}

export interface OrganizationInterface {
  title: string;
  btnFilter: string;
  btnAdd: string;
  noDataTitle: string;
  noDataDescription: string;
  newHealthNetwork: string;
  popUp: PopUp4Interface;
  deleteDialog: DeleteDialog3Interface;
}

export interface Page404Interface {
  title: string;
  description: string;
  backbtn: string;
}

export interface DataNotFoundInterface {
  title: string;
  description: string;
  backbtn: string;
}

export interface Page505Interface {
  title: string;
  description: string;
}

export interface DropzoneInterface {
  heading: string;
  description: string;
  button: string;
  info: string;
}

export interface HealthNetworkInterface {
  name: string;
  logo: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}

export interface SiteSectionInterface {
  site: string;
}

export interface ConfirmSiteModal {
  dialogMessage: "Sites do not exist for this organization, you have to create site first to create system.";
  noButton: "Cancel";
  yesButton: "Add Site";
}

export interface LocalizationInterface {
  users: UsersInterface;
  modalities: ModalitiesInterface;
  sites: SitesInterface;
  documentation: DocumentationInterface;
  organization: OrganizationInterface;
  page404: Page404Interface;
  dataNotFound: DataNotFoundInterface;
  page505: Page505Interface;
  dropzone: DropzoneInterface;
  healthNetwork: HealthNetworkInterface;
  siteSection: SiteSectionInterface;
  systemModal: SystemModal;
  confirmSiteDialog: ConfirmSiteModal;
}
