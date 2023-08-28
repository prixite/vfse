// import { Dispatch, SetStateAction } from "react";

// import { Me, System } from "@src/store/reducers/generated";

// export interface Common {
//   searching: string;
//   Forum: string;
// }

// export interface PopUp {
//   userNameText: string;
//   emailText: string;
//   btnAdd: string;
//   btnCancel: string;
//   btnSave: string;
//   btnNext: string;
//   btnAddUser: string;
//   btnEditUser: string;
//   addNewUser: string;
//   pageTrackerdesc1: string;
//   pageTrackerdesc2: string;
//   userFirstName: string;
//   btnToSave: string;
//   userLastName: string;
//   userEmail: string;
//   userPhoneNumber: string;
//   userRole: string;
//   userManager: string;
//   userCustomer: string;
//   newUser: string;
//   imageRequired: string;
//   firstNameRequired: string;
//   lastNameRequired: string;
//   invalidEmailText: string;
//   emailRequired: string;
//   phoneNumberValidation: string;
//   invalidPhoneFormat: string;
//   phoneRequired: string;
//   addText: string;
//   selectManager: string;
//   manager: string;
//   customer: string;
//   role: string;
//   edit: string;
//   userProfileImage: string;
//   phone: string;
//   selectedSites: string;
//   selectedSystems: string;
//   selectedModalities: string;
//   accessToFSEFunctions: string;
//   auditEnable: string;
//   possibilitytoLeave: string;
//   viewOnly: string;
//   oneTimeLinkCreation: string;
//   docLink: string;
//   userProfileImageText: string;
//   editUserText: string;
//   profileImageText: string;
//   sitesText: string;
//   healthNetworkAccessText: string;
//   organizationSitesText: string;
//   accessToModalities: string;
// }

// export interface Users {
//   addUser: string;
//   userAdministration: string;
//   btnFilter: string;
//   btnAdd: string;
//   popUp: PopUp;
// }

// export interface ManufacturerInterface {
//   nameRequired: string;
//   title: string;
//   addBtn: string;
//   cancelBtn: string;
//   subHeading: string;
// }

// export interface UserMenuOptions {
//   lock: string;
//   unlock: string;
//   edit: string;
//   delete_user: string;
// }

// export interface CardPopUp {
//   edit: string;
//   delete: string;
// }

// export interface PopUp2 {
//   popUpNewNetwork: string;
//   newNetworkAddSite: string;
//   newNetworkLogo: string;
//   newNetworkName: string;
//   newNetworkBtnSave: string;
//   newNetworkBtnCancel: string;
// }
// export interface ProductInterface {
//   nameRequired: string;
//   title: string;
//   addBtn: string;
//   cancelBtn: string;
//   subHeading: string;
// }

// export interface AddProductModelDialogInterface {
//   nameRequired: string;
//   title: string;
//   addBtn: string;
//   cancelBtn: string;
//   subHeading: string;
// }
// export interface DeleteDialog {
//   dialogMessage: string;
//   noButton: string;
//   yesButton: string;
// }

// export interface Modalities {
//   title: string;
//   btnFilter: string;
//   btnAdd: string;
//   noDataTitle: string;
//   noDataDescription: string;
//   cardPopUp: CardPopUp;
//   popUp: PopUp2;
//   deleteDialog: DeleteDialog;
// }

// export interface PopUp3 {
//   popUpNewNetwork: string;
//   newNetworkAddSite: string;
//   newNetworkLogo: string;
//   newNetworkName: string;
//   newNetworkBtnSave: string;
//   newNetworkBtnCancel: string;
// }

// export interface CardPopUp2 {
//   editSite: string;
//   deleteSite: string;
// }

// export interface DeleteDialog2 {
//   dialogMessage: string;
//   noButton: string;
//   yesButton: string;
// }

// export interface Sites {
//   title: string;
//   btnFilter: string;
//   btnAdd: string;
//   btnEdit: string;
//   noResultMsg: string;
//   noDataTitle: string;
//   noDataDescription: string;
//   popUp: PopUp3;
//   cardPopUp: CardPopUp2;
//   deleteDialog: DeleteDialog2;
// }

// export interface PopUp4 {
//   title: string;
//   editTitle: string;
//   link: string;
//   upload_btn: string;
//   model: string;
//   product_model: string;
//   btnSave: string;
//   btnToSave: string;
//   modalities: string;
//   btnEdit: string;
//   btnCancel: string;
//   addText: string;
//   docLinkText: string;
//   modalText: string;
//   modalityText: string;
//   editText: string;
//   pdf: string;
// }

// export interface Documentation {
//   title: string;
//   btnFilter: string;
//   btnCol: string;
//   btnAsset: string;
//   btnAdd: string;
//   popUp: PopUp4;
// }

// export interface Systems {
//   title: string;
//   btnFilter: string;
//   btnCol: string;
//   btnAsset: string;
//   noDataTitle: string;
//   noDataDescription: string;
//   btnAdd: string;
// }

// export interface SystemsCard {
//   his_ris_info_txt: string;
//   dicom_info_txt: string;
//   serial_txt: string;
//   is_online: string;
//   latest_ping: string;
//   asset_txt: string;
//   helium_level: string;
//   mpc_status: string;
//   copy_btn: string;
//   ip_address_txt: string;
//   local_ae_title_txt: string;
//   software_version_txt: string;
//   location: string;
//   connect: string;
//   grafana_link_txt: string;
// }
// export interface profileHeader {
//   editText: string;
// }

// export interface OrganizationMenuOptions {
//   switch_org: string;
//   edit: string;
//   new_network: string;
//   delete_org: string;
// }

// export interface PopUp5 {
//   popUpNewOrganization: string;
//   newOrganizationPageTrackerdesc1: string;
//   newOrganizationPageTrackerdesc2: string;
//   newOrganizationName: string;
//   newOrganizationSeats: string;
//   newOrganizationBtnNext: string;
//   newOrganizationBtnSave: string;
//   newOrganizationBtnCancel: string;
//   newOrganizationLogo: string;
//   newOrganizationColor1: string;
//   newOrganizationColor2: string;
//   newOrganizationColor3: string;
//   newOrganizationColor4: string;
//   newOrganizationFont1: string;
//   newOrganizationFont2: string;
//   newOrganizationHealthNetworks: string;
//   newOrganizationAddNetwork: string;
// }

// export interface DeleteDialog3 {
//   dialogMessage: string;
//   noButton: string;
//   yesButton: string;
// }

// export interface Organization {
//   title: string;
//   btnFilter: string;
//   btnAdd: string;
//   noDataTitle: string;
//   noDataDescription: string;
//   newHealthNetwork: string;
//   popUp: PopUp5;
//   deleteDialog: DeleteDialog3;
// }

// export interface Page404 {
//   title: string;
//   description: string;
//   backbtn: string;
// }

// export interface DataNotFound {
//   title: string;
//   description: string;
//   backbtn: string;
// }

// export interface Page505 {
//   title: string;
//   description: string;
// }

// export interface DropzoneOptions {
//   uploadAndHide: string;
//   upload: string;
// }
// export interface Dropzone {
//   heading: string;
//   description: string;
//   button: string;
//   info: string;
//   options: DropzoneOptions;
// }

// export interface HealthNetwork {
//   name: string;
//   logo: string;
//   color1: string;
//   color2: string;
//   color3: string;
//   color4: string;
//   nameRequired: string;
//   imageRequired: string;
//   networkDuplicateError: string;
// }

// export interface SiteSection {
//   site: string;
// }

// export interface SiteModal {
//   fieldName: string;
//   fieldAddress: string;
//   btnAdd: string;
//   btnEdit: string;
//   btnCancel: string;
// }

// export interface SystemModal {
//   fieldName: string;
//   fieldManufacturer: string;
//   fieldModality: string;
//   fieldProduct: string;
//   fieldLocation: string;
//   fieldLink: string;
//   fieldNumber: string;
//   fieldSite: string;
//   fieldModal: string;
//   fieldVersion: string;
//   fieldAsset: string;
//   fieldIp: string;
//   fieldLocalAE: string;
//   fieldRisName: string;
//   fieldRisIp: string;
//   fieldRisTitle: string;
//   fieldRisPort: string;
//   fieldRisAE: string;
//   fieldDicomName: string;
//   fieldDicomIp: string;
//   fieldDicomTitle: string;
//   fieldDicomPort: string;
//   fieldDicomAE: string;
//   fieldMRIname: string;
//   fieldMRIHelium: string;
//   fieldMRIMagnet: string;
//   headdingAddInfo: string;
//   btnAdd: string;
//   btnEdit: string;
//   btnCancel: string;
// }

// export interface ConfirmSiteDialog {
//   dialogMessage: string;
//   noButton: string;
//   yesButton: string;
// }

// export interface KnowledgeBase {
//   title: string;
//   subTitle: string;
// }

// export interface ArticleCard {
//   numberTitle: string;
//   explore: string;
//   deleteCard: string;
// }

// export interface folderSection {
//   backBtn: string;
// }
// export interface allCategoriesSection {
//   Message: string;
// }

// export interface ConfirmSiteModal {
//   dialogMessage: "Sites do not exist for this organization, you have to create site first to create system.";
//   noButton: "Cancel";
//   yesButton: "Add Site";
// }

// export interface document {
//   backBtn: string;
//   title: string;
//   btnEdit: string;
//   btnCopy: string;
// }

// export interface articleDescription {
//   backBtn: string;
//   title1: string;
//   title2: string;
//   title3: string;
// }
// export interface selectedArticleCard {
//   text: string;
//   title: string;
//   folderId: number;
//   categories: number[];
//   categoryName: string;
// }
// export interface toastData {
//   documentationBtnLinkCopy: string;
//   commentCardCommentFailed: string;
//   clientCardOrgDeleteSuccess: string;
//   articleCardFolderDeleteSuccess: string;
//   articleCardFolderDeleteError: string;
//   chatBoxReqProceedError: string;
//   chatBoxErrorOcccured: string;
//   knowledgeCardArticleDeleteSuccess: string;
//   knowledgeCardArticleDeleteError: string;
//   networkCardDeleteSuccess: string;
//   systemCardDeleteSuccess: string;
//   systemCardConnectionError: string;
//   systemCardLinkCopiedSuccess: string;
//   accountSectionUsernameUpdateSuccess: string;
//   appearanceSectionClientUpdateSuccess: string;
//   appearanceSectionClientUpdateError: string;
//   commentsDrawerAddNoteError: string;
//   editCommentUpdateError: string;
//   articleUpdateSuccess: string;
//   documentationSectionLinkCopiedSuccess: string;
//   documentationSectionDeleteSuccess: string;
//   userSectionLocked: string;
//   userSectionUnlocked: string;
//   articleAddSuccess: string;
//   articleAddError: string;
//   categoryAddSuccess: string;
//   categoryEditSuccess: string;
//   categoryAddError: string;
//   categoryDeleteSuccess: string;
//   categoryDeleteError: string;
//   categoryEditError: string;
//   modalAlreadyExists: string;
//   folderAddSuccess: string;
//   folderAddError: string;
//   folderUpdateSuccess: string;
//   folderUpdateError: string;
//   saveHealthNetworkError: string;
//   addHealthNetworkError: string;
//   uploadImageFailedError: string;
//   addOrganizationError: string;
//   saveOrganizationError: string;
//   addNetworksFirstError: string;
//   saveSiteError: string;
//   siteAlreadyExistsError: string;
//   systemSaveSuccess: string;
//   systemSaveError: string;
//   topicCreatedSuccess: string;
//   topicCreatedError: string;
//   userAlreadyExists: string;
//   saveUserError: string;
// }
// export interface FolderModalPopUp {
//   nameRequired: string;
//   addFolderText: string;
//   folderNameText: string;
//   folderCategoryText: string;
//   cancel: string;
//   editFolderText: string;
//   chooseCategories: string;
// }

// export interface LocalizationInterface {
//   Faq: { dashboard: unknown; topicUpdates: unknown; seeAll: unknown };
//   Forum: { btnCreateTopic: unknown; forum: unknown; title: string };
//   common: Common;
//   users: Users;
//   user_menu_options: UserMenuOptions;
//   modalities: Modalities;
//   sites: Sites;
//   documentation: Documentation;
//   systems: Systems;
//   systems_card: SystemsCard;
//   profileHeader: profileHeader;
//   organization_menu_options: OrganizationMenuOptions;
//   organization: Organization;
//   page404: Page404;
//   dataNotFound: DataNotFound;
//   page505: Page505;
//   dropzone: Dropzone;
//   healthNetwork: HealthNetwork;
//   siteSection: SiteSection;
//   siteModal: SiteModal;
//   systemModal: SystemModal;
//   confirmSiteDialog: ConfirmSiteDialog;
//   knowledgeBase: KnowledgeBase;
//   articleCard: ArticleCard;
//   folderSection: folderSection;
//   document: document;
//   articleDescription: articleDescription;
//   ManufacturerModal: ManufacturerInterface;
//   ProductModal: ProductInterface;
//   addProductModelDialog: AddProductModelDialogInterface;
//   selectedArticleCard: selectedArticleCard;
//   toastData: toastData;
//   FolderModalPopUp: FolderModalPopUp;
//   allCategoriesSection: allCategoriesSection;
// }

// export interface SystemInterfaceProps {
//   system: System;
//   handleEdit?: (system: System) => void;
//   setSystem?: Dispatch<SetStateAction<System>>;
//   setIsOpen?: Dispatch<SetStateAction<boolean>>;
//   canLeaveNotes: boolean;
//   currentUser: Me;
//   viewSystemLocation?: (system: System) => void;
//   onSupport?: (system: System) => void;
// }
