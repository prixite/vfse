import { emptySplitApi as api } from "@src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    accountsRequestsCreate: build.mutation<
      AccountsRequestsCreateApiResponse,
      AccountsRequestsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/accounts/requests/`,
        method: "POST",
        body: queryArg.userRequestAcessSeriazlizer,
      }),
    }),
    healthNetworksList: build.query<
      HealthNetworksListApiResponse,
      HealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/health_networks/`,
        params: { name: queryArg.name, search: queryArg.search },
      }),
    }),
    lambdaPartialUpdate: build.mutation<
      LambdaPartialUpdateApiResponse,
      LambdaPartialUpdateApiArg
    >({
      query: () => ({ url: `/lambda/`, method: "PATCH" }),
    }),
    manufacturersList: build.query<
      ManufacturersListApiResponse,
      ManufacturersListApiArg
    >({
      query: () => ({ url: `/manufacturers/` }),
    }),
    manufacturersCreate: build.mutation<
      ManufacturersCreateApiResponse,
      ManufacturersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/manufacturers/`,
        method: "POST",
        body: queryArg.manufacturer,
      }),
    }),
    manufacturersImagesList: build.query<
      ManufacturersImagesListApiResponse,
      ManufacturersImagesListApiArg
    >({
      query: () => ({ url: `/manufacturers/images/` }),
    }),
    manufacturersImagesCreate: build.mutation<
      ManufacturersImagesCreateApiResponse,
      ManufacturersImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/manufacturers/images/`,
        method: "POST",
        body: queryArg.manufacturerImage,
      }),
    }),
    modalitiesManufacturersList: build.query<
      ModalitiesManufacturersListApiResponse,
      ModalitiesManufacturersListApiArg
    >({
      query: (queryArg) => ({
        url: `/modalities/${queryArg.id}/manufacturers/`,
      }),
    }),
    notesPartialUpdate: build.mutation<
      NotesPartialUpdateApiResponse,
      NotesPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/notes/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.noteSerialier,
      }),
    }),
    notesDelete: build.mutation<NotesDeleteApiResponse, NotesDeleteApiArg>({
      query: (queryArg) => ({
        url: `/notes/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    organizationsList: build.query<
      OrganizationsListApiResponse,
      OrganizationsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/`,
        params: { name: queryArg.name, search: queryArg.search },
      }),
    }),
    organizationsCreate: build.mutation<
      OrganizationsCreateApiResponse,
      OrganizationsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/`,
        method: "POST",
        body: queryArg.organization,
      }),
    }),
    organizationsExistsRead: build.query<
      OrganizationsExistsReadApiResponse,
      OrganizationsExistsReadApiArg
    >({
      query: () => ({ url: `/organizations/exists/` }),
    }),
    organizationsRead: build.query<
      OrganizationsReadApiResponse,
      OrganizationsReadApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/` }),
    }),
    organizationsPartialUpdate: build.mutation<
      OrganizationsPartialUpdateApiResponse,
      OrganizationsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.organization,
      }),
    }),
    organizationsDelete: build.mutation<
      OrganizationsDeleteApiResponse,
      OrganizationsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    organizationsAssociatedSitesList: build.query<
      OrganizationsAssociatedSitesListApiResponse,
      OrganizationsAssociatedSitesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/associated_sites/`,
      }),
    }),
    organizationsHealthNetworksList: build.query<
      OrganizationsHealthNetworksListApiResponse,
      OrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
      }),
    }),
    organizationsHealthNetworksCreate: build.mutation<
      OrganizationsHealthNetworksCreateApiResponse,
      OrganizationsHealthNetworksCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
        method: "POST",
        body: queryArg.healthNetwork,
      }),
    }),
    organizationsHealthNetworksUpdate: build.mutation<
      OrganizationsHealthNetworksUpdateApiResponse,
      OrganizationsHealthNetworksUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
        method: "PUT",
        body: queryArg.organizationHealthNetwork,
      }),
    }),
    organizationsMeRead: build.query<
      OrganizationsMeReadApiResponse,
      OrganizationsMeReadApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/me/` }),
    }),
    organizationsModalitiesList: build.query<
      OrganizationsModalitiesListApiResponse,
      OrganizationsModalitiesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/modalities/`,
      }),
    }),
    organizationsSeatsList: build.query<
      OrganizationsSeatsListApiResponse,
      OrganizationsSeatsListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/seats/` }),
    }),
    organizationsSeatsCreate: build.mutation<
      OrganizationsSeatsCreateApiResponse,
      OrganizationsSeatsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/seats/`,
        method: "POST",
        body: queryArg.organizationSeatSeriazlier,
      }),
    }),
    organizationsSitesList: build.query<
      OrganizationsSitesListApiResponse,
      OrganizationsSitesListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/sites/` }),
    }),
    organizationsSitesCreate: build.mutation<
      OrganizationsSitesCreateApiResponse,
      OrganizationsSitesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/sites/`,
        method: "POST",
        body: queryArg.metaSite,
      }),
    }),
    organizationsSitesUpdate: build.mutation<
      OrganizationsSitesUpdateApiResponse,
      OrganizationsSitesUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/sites/`,
        method: "PUT",
        body: queryArg.organizationSite,
      }),
    }),
    organizationsSystemsList: build.query<
      OrganizationsSystemsListApiResponse,
      OrganizationsSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/`,
        params: {
          site: queryArg.site,
          health_network: queryArg.healthNetwork,
          modality: queryArg.modality,
        },
      }),
    }),
    organizationsSystemsCreate: build.mutation<
      OrganizationsSystemsCreateApiResponse,
      OrganizationsSystemsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/`,
        method: "POST",
        body: queryArg.system,
      }),
    }),
    organizationsSystemsRead: build.query<
      OrganizationsSystemsReadApiResponse,
      OrganizationsSystemsReadApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/`,
      }),
    }),
    organizationsSystemsPartialUpdate: build.mutation<
      OrganizationsSystemsPartialUpdateApiResponse,
      OrganizationsSystemsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/`,
        method: "PATCH",
        body: queryArg.system,
      }),
    }),
    organizationsSystemsDelete: build.mutation<
      OrganizationsSystemsDeleteApiResponse,
      OrganizationsSystemsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/`,
        method: "DELETE",
      }),
    }),
    organizationsUsersList: build.query<
      OrganizationsUsersListApiResponse,
      OrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/users/` }),
    }),
    organizationsUsersCreate: build.mutation<
      OrganizationsUsersCreateApiResponse,
      OrganizationsUsersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/users/`,
        method: "POST",
        body: queryArg.organizationUpsertUser,
      }),
    }),
    productsList: build.query<ProductsListApiResponse, ProductsListApiArg>({
      query: (queryArg) => ({
        url: `/products/`,
        params: { manufacturer: queryArg.manufacturer },
      }),
    }),
    productsCreate: build.mutation<
      ProductsCreateApiResponse,
      ProductsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/`,
        method: "POST",
        body: queryArg.productCreate,
      }),
    }),
    productsModelsList: build.query<
      ProductsModelsListApiResponse,
      ProductsModelsListApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/`,
        params: { modality: queryArg.modality, product: queryArg.product },
      }),
    }),
    productsModelsCreate: build.mutation<
      ProductsModelsCreateApiResponse,
      ProductsModelsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/`,
        method: "POST",
        body: queryArg.productModelCreate,
      }),
    }),
    productsModelsPartialUpdate: build.mutation<
      ProductsModelsPartialUpdateApiResponse,
      ProductsModelsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.productModelCreate,
      }),
    }),
    productsModelsDelete: build.mutation<
      ProductsModelsDeleteApiResponse,
      ProductsModelsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    productsPartialUpdate: build.mutation<
      ProductsPartialUpdateApiResponse,
      ProductsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.product,
      }),
    }),
    productsDelete: build.mutation<
      ProductsDeleteApiResponse,
      ProductsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/products/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    systemsImagesList: build.query<
      SystemsImagesListApiResponse,
      SystemsImagesListApiArg
    >({
      query: () => ({ url: `/systems/images/` }),
    }),
    systemsImagesCreate: build.mutation<
      SystemsImagesCreateApiResponse,
      SystemsImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/images/`,
        method: "POST",
        body: queryArg.systemImage,
      }),
    }),
    systemsNotesList: build.query<
      SystemsNotesListApiResponse,
      SystemsNotesListApiArg
    >({
      query: (queryArg) => ({ url: `/systems/${queryArg.id}/notes/` }),
    }),
    systemsNotesCreate: build.mutation<
      SystemsNotesCreateApiResponse,
      SystemsNotesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/${queryArg.id}/notes/`,
        method: "POST",
        body: queryArg.systemNotes,
      }),
    }),
    usersActivatePartialUpdate: build.mutation<
      UsersActivatePartialUpdateApiResponse,
      UsersActivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/activate/`,
        method: "PATCH",
        body: queryArg.userEnableDisable,
      }),
    }),
    usersDeactivatePartialUpdate: build.mutation<
      UsersDeactivatePartialUpdateApiResponse,
      UsersDeactivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/deactivate/`,
        method: "PATCH",
        body: queryArg.userEnableDisable,
      }),
    }),
    usersRolesList: build.query<
      UsersRolesListApiResponse,
      UsersRolesListApiArg
    >({
      query: () => ({ url: `/users/roles/` }),
    }),
    usersPartialUpdate: build.mutation<
      UsersPartialUpdateApiResponse,
      UsersPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.upsertUser,
      }),
    }),
    vfseCategoriesList: build.query<
      VfseCategoriesListApiResponse,
      VfseCategoriesListApiArg
    >({
      query: () => ({ url: `/vfse/categories/` }),
    }),
    vfseDocumentsList: build.query<
      VfseDocumentsListApiResponse,
      VfseDocumentsListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/`,
        params: { folder: queryArg.folder, favorite: queryArg.favorite },
      }),
    }),
    vfseDocumentsCreate: build.mutation<
      VfseDocumentsCreateApiResponse,
      VfseDocumentsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/`,
        method: "POST",
        body: queryArg.document,
      }),
    }),
    vfseDocumentsPartialUpdate: build.mutation<
      VfseDocumentsPartialUpdateApiResponse,
      VfseDocumentsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.document,
      }),
    }),
    vfseDocumentsDelete: build.mutation<
      VfseDocumentsDeleteApiResponse,
      VfseDocumentsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    vfseFoldersList: build.query<
      VfseFoldersListApiResponse,
      VfseFoldersListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/`,
        params: { categories: queryArg.categories },
      }),
    }),
    vfseFoldersCreate: build.mutation<
      VfseFoldersCreateApiResponse,
      VfseFoldersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/`,
        method: "POST",
        body: queryArg.folder,
      }),
    }),
    vfseFoldersPartialUpdate: build.mutation<
      VfseFoldersPartialUpdateApiResponse,
      VfseFoldersPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.folder,
      }),
    }),
    vfseFoldersDelete: build.mutation<
      VfseFoldersDeleteApiResponse,
      VfseFoldersDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as rtk };
export type AccountsRequestsCreateApiResponse =
  /** status 201  */ UserRequestAcessSeriazlizer;
export type AccountsRequestsCreateApiArg = {
  userRequestAcessSeriazlizer: UserRequestAcessSeriazlizer;
};
export type HealthNetworksListApiResponse =
  /** status 200  */ HealthNetworkList[];
export type HealthNetworksListApiArg = {
  name?: string;
  search?: string;
};
export type LambdaPartialUpdateApiResponse = unknown;
export type LambdaPartialUpdateApiArg = void;
export type ManufacturersListApiResponse = /** status 200  */ Manufacturer[];
export type ManufacturersListApiArg = void;
export type ManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type ManufacturersImagesListApiResponse =
  /** status 200  */ ManufacturerImage[];
export type ManufacturersImagesListApiArg = void;
export type ManufacturersImagesCreateApiResponse =
  /** status 201  */ ManufacturerImage;
export type ManufacturersImagesCreateApiArg = {
  manufacturerImage: ManufacturerImage;
};
export type ModalitiesManufacturersListApiResponse =
  /** status 200  */ Manufacturer[];
export type ModalitiesManufacturersListApiArg = {
  id: string;
};
export type NotesPartialUpdateApiResponse = /** status 200  */ NoteSerialier;
export type NotesPartialUpdateApiArg = {
  id: string;
  noteSerialier: NoteSerialier;
};
export type NotesDeleteApiResponse = unknown;
export type NotesDeleteApiArg = {
  id: string;
};
export type OrganizationsListApiResponse = /** status 200  */ Organization[];
export type OrganizationsListApiArg = {
  name?: string;
  search?: string;
};
export type OrganizationsCreateApiResponse = /** status 201  */ Organization;
export type OrganizationsCreateApiArg = {
  organization: Organization;
};
export type OrganizationsExistsReadApiResponse =
  /** status 200  */ Organization;
export type OrganizationsExistsReadApiArg = void;
export type OrganizationsReadApiResponse = /** status 200  */ Organization;
export type OrganizationsReadApiArg = {
  id: string;
};
export type OrganizationsPartialUpdateApiResponse =
  /** status 200  */ Organization;
export type OrganizationsPartialUpdateApiArg = {
  id: string;
  organization: Organization;
};
export type OrganizationsDeleteApiResponse = unknown;
export type OrganizationsDeleteApiArg = {
  id: string;
};
export type OrganizationsAssociatedSitesListApiResponse =
  /** status 200  */ Site[];
export type OrganizationsAssociatedSitesListApiArg = {
  id: string;
};
export type OrganizationsHealthNetworksListApiResponse =
  /** status 200  */ HealthNetwork[];
export type OrganizationsHealthNetworksListApiArg = {
  id: string;
};
export type OrganizationsHealthNetworksCreateApiResponse =
  /** status 201  */ HealthNetwork;
export type OrganizationsHealthNetworksCreateApiArg = {
  id: string;
  healthNetwork: HealthNetwork;
};
export type OrganizationsHealthNetworksUpdateApiResponse =
  /** status 200  */ OrganizationHealthNetwork;
export type OrganizationsHealthNetworksUpdateApiArg = {
  id: string;
  organizationHealthNetwork: OrganizationHealthNetwork;
};
export type OrganizationsMeReadApiResponse = /** status 200  */ Me;
export type OrganizationsMeReadApiArg = {
  id: string;
};
export type OrganizationsModalitiesListApiResponse =
  /** status 200  */ Modality[];
export type OrganizationsModalitiesListApiArg = {
  id: string;
};
export type OrganizationsSeatsListApiResponse = /** status 200  */ SeatList[];
export type OrganizationsSeatsListApiArg = {
  id: string;
};
export type OrganizationsSeatsCreateApiResponse =
  /** status 201  */ OrganizationSeatSeriazlier;
export type OrganizationsSeatsCreateApiArg = {
  id: string;
  organizationSeatSeriazlier: OrganizationSeatSeriazlier;
};
export type OrganizationsSitesListApiResponse = /** status 200  */ Site[];
export type OrganizationsSitesListApiArg = {
  id: string;
};
export type OrganizationsSitesCreateApiResponse = /** status 201  */ MetaSite;
export type OrganizationsSitesCreateApiArg = {
  id: string;
  metaSite: MetaSite;
};
export type OrganizationsSitesUpdateApiResponse =
  /** status 200  */ OrganizationSite;
export type OrganizationsSitesUpdateApiArg = {
  id: string;
  organizationSite: OrganizationSite;
};
export type OrganizationsSystemsListApiResponse = /** status 200  */ System[];
export type OrganizationsSystemsListApiArg = {
  id: string;
  site?: string;
  healthNetwork?: number;
  modality?: number;
};
export type OrganizationsSystemsCreateApiResponse = /** status 201  */ System;
export type OrganizationsSystemsCreateApiArg = {
  id: string;
  system: System;
};
export type OrganizationsSystemsReadApiResponse = /** status 200  */ System;
export type OrganizationsSystemsReadApiArg = {
  id: string;
  systemPk: string;
};
export type OrganizationsSystemsPartialUpdateApiResponse =
  /** status 200  */ System;
export type OrganizationsSystemsPartialUpdateApiArg = {
  id: string;
  systemPk: string;
  system: System;
};
export type OrganizationsSystemsDeleteApiResponse = unknown;
export type OrganizationsSystemsDeleteApiArg = {
  id: string;
  systemPk: string;
};
export type OrganizationsUsersListApiResponse = /** status 200  */ User[];
export type OrganizationsUsersListApiArg = {
  id: string;
};
export type OrganizationsUsersCreateApiResponse =
  /** status 201  */ OrganizationUpsertUser;
export type OrganizationsUsersCreateApiArg = {
  id: string;
  organizationUpsertUser: OrganizationUpsertUser;
};
export type ProductsListApiResponse = /** status 200  */ Product[];
export type ProductsListApiArg = {
  manufacturer?: number;
};
export type ProductsCreateApiResponse = /** status 201  */ ProductCreate;
export type ProductsCreateApiArg = {
  productCreate: ProductCreate;
};
export type ProductsModelsListApiResponse =
  /** status 200  */ ProductModelDetail[];
export type ProductsModelsListApiArg = {
  modality?: number;
  product?: number;
};
export type ProductsModelsCreateApiResponse =
  /** status 201  */ ProductModelCreate;
export type ProductsModelsCreateApiArg = {
  productModelCreate: ProductModelCreate;
};
export type ProductsModelsPartialUpdateApiResponse =
  /** status 200  */ ProductModelCreate;
export type ProductsModelsPartialUpdateApiArg = {
  id: string;
  productModelCreate: ProductModelCreate;
};
export type ProductsModelsDeleteApiResponse = unknown;
export type ProductsModelsDeleteApiArg = {
  id: string;
};
export type ProductsPartialUpdateApiResponse = /** status 200  */ Product;
export type ProductsPartialUpdateApiArg = {
  id: string;
  product: Product;
};
export type ProductsDeleteApiResponse = unknown;
export type ProductsDeleteApiArg = {
  id: string;
};
export type SystemsImagesListApiResponse = /** status 200  */ SystemImage[];
export type SystemsImagesListApiArg = void;
export type SystemsImagesCreateApiResponse = /** status 201  */ SystemImage;
export type SystemsImagesCreateApiArg = {
  systemImage: SystemImage;
};
export type SystemsNotesListApiResponse = /** status 200  */ SystemNotes[];
export type SystemsNotesListApiArg = {
  id: string;
};
export type SystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type SystemsNotesCreateApiArg = {
  id: string;
  systemNotes: SystemNotes;
};
export type UsersActivatePartialUpdateApiResponse =
  /** status 200  */ UserEnableDisable;
export type UsersActivatePartialUpdateApiArg = {
  userEnableDisable: UserEnableDisable;
};
export type UsersDeactivatePartialUpdateApiResponse =
  /** status 200  */ UserEnableDisable;
export type UsersDeactivatePartialUpdateApiArg = {
  userEnableDisable: UserEnableDisable;
};
export type UsersRolesListApiResponse = unknown;
export type UsersRolesListApiArg = void;
export type UsersPartialUpdateApiResponse = /** status 200  */ UpsertUser;
export type UsersPartialUpdateApiArg = {
  id: string;
  upsertUser: UpsertUser;
};
export type VfseCategoriesListApiResponse = /** status 200  */ Category[];
export type VfseCategoriesListApiArg = void;
export type VfseDocumentsListApiResponse = /** status 200  */ Document[];
export type VfseDocumentsListApiArg = {
  folder?: string;
  favorite?: string;
};
export type VfseDocumentsCreateApiResponse = /** status 201  */ Document;
export type VfseDocumentsCreateApiArg = {
  document: Document;
};
export type VfseDocumentsPartialUpdateApiResponse = /** status 200  */ Document;
export type VfseDocumentsPartialUpdateApiArg = {
  id: string;
  document: Document;
};
export type VfseDocumentsDeleteApiResponse = unknown;
export type VfseDocumentsDeleteApiArg = {
  id: string;
};
export type VfseFoldersListApiResponse = /** status 200  */ Folder[];
export type VfseFoldersListApiArg = {
  categories?: string;
};
export type VfseFoldersCreateApiResponse = /** status 201  */ Folder;
export type VfseFoldersCreateApiArg = {
  folder: Folder;
};
export type VfseFoldersPartialUpdateApiResponse = /** status 200  */ Folder;
export type VfseFoldersPartialUpdateApiArg = {
  id: string;
  folder: Folder;
};
export type VfseFoldersDeleteApiResponse = unknown;
export type VfseFoldersDeleteApiArg = {
  id: string;
};
export type Meta = {
  profile_picture: string;
  title?: string;
};
export type UserRequestAcessSeriazlizer = {
  meta?: Meta;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role:
    | "fse-admin"
    | "customer-admin"
    | "user-admin"
    | "fse"
    | "end-user"
    | "view-only"
    | "one-time"
    | "cryo"
    | "cryo-fse"
    | "cryo-admin";
  manager?: number;
  organization: number;
  sites?: number[];
  modalities?: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
  documentation_url: boolean;
  health_networks: number[];
};
export type HealthNetworkList = {
  id?: number;
  name: string;
};
export type Manufacturer = {
  id?: number;
  name: string;
  image?: number | null;
};
export type ManufacturerImage = {
  image?: string | null;
};
export type NoteSerialier = {
  id?: number;
  note: string;
};
export type Appearance = {
  sidebar_text?: string;
  button_text?: string;
  sidebar_color?: string;
  primary_color?: string;
  secondary_color?: string;
  font_one?: string;
  font_two?: string;
  logo?: string;
  banner?: string;
  icon?: string;
};
export type MetaSite = {
  id?: number;
  name: string;
  address: string;
};
export type Organization = {
  id?: number;
  name: string;
  number_of_seats?: number | null;
  appearance?: Appearance;
  sites?: MetaSite[];
};
export type Site = {
  id?: number;
  name: string;
  address: string;
  modalities?: string[];
  connections?: number;
};
export type Appearance2 = {
  logo: string;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  appearance?: Appearance2;
  sites?: MetaSite[];
};
export type HealthNetworkCreate = {
  id?: number | null;
  name: string;
  appearance?: Appearance2;
  sites?: MetaSite[];
};
export type OrganizationHealthNetwork = {
  id?: number;
  health_networks: HealthNetworkCreate[];
};
export type Me = {
  id?: number;
  first_name?: string;
  last_name?: string;
  flags?: string;
  organization?: Organization;
  role?: string;
  profile_picture: string;
  is_superuser?: boolean;
};
export type Modality = {
  id?: number;
  name: string;
  group?:
    | (
        | "mri"
        | "pet"
        | "rf"
        | "bmd"
        | "cr"
        | "dx"
        | "ivus"
        | "mg"
        | "us"
        | "mi"
        | "mr"
        | "ct"
      )
    | null;
};
export type Product = {
  id?: number;
  name: string;
  manufacturer: Manufacturer;
};
export type Documentation = {
  id?: number;
  url: string;
};
export type ProductModelDetail = {
  id?: number;
  product: Product;
  model: string;
  modality: Modality;
  documentation: Documentation;
};
export type HisRisInfo = {
  ip?: string;
  title?: string;
  port?: number;
  ae_title?: string;
};
export type MriEmbeddedParameters = {
  helium?: string;
  magnet_pressure?: string;
};
export type ConnectionOptions = {
  vfse: boolean;
  virtual_media_control: boolean;
  service_web_browser: boolean;
  ssh: boolean;
};
export type System = {
  id?: number;
  name: string;
  site: number;
  serial_number?: string | null;
  location_in_building?: string | null;
  system_contact_info?: string | null;
  grafana_link?: string | null;
  product_model: number;
  product_model_detail?: ProductModelDetail;
  image?: number | null;
  software_version: string;
  asset_number: string;
  ip_address: string;
  local_ae_title: string;
  his_ris_info?: HisRisInfo;
  dicom_info?: HisRisInfo;
  mri_embedded_parameters?: MriEmbeddedParameters;
  connection_options?: ConnectionOptions;
  image_url?: string;
  documentation?: string;
  is_online?: boolean;
  last_successful_ping_at?: string | null;
};
export type SeatList = {
  system: System;
};
export type Seat = {
  system: number;
};
export type OrganizationSeatSeriazlier = {
  seats: Seat[];
};
export type SiteCreate = {
  id?: number | null;
  name: string;
  address: string;
  modalities?: string[];
  connections?: number;
};
export type OrganizationSite = {
  id?: number;
  sites: SiteCreate[];
};
export type Manager = {
  email: string;
  name: string;
};
export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username: string;
  is_active?: boolean;
  health_networks?: string[];
  modalities?: string[];
  organizations?: string[];
  phone?: string;
  fse_accessible?: boolean;
  audit_enabled?: boolean;
  can_leave_notes?: boolean;
  view_only?: boolean;
  is_one_time?: boolean;
  documentation_url?: boolean;
  role?: string[];
  manager?: Manager;
  image?: string;
  sites?: string[];
};
export type UpsertUser = {
  meta?: Meta;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role:
    | "fse-admin"
    | "customer-admin"
    | "user-admin"
    | "fse"
    | "end-user"
    | "view-only"
    | "one-time"
    | "cryo"
    | "cryo-fse"
    | "cryo-admin";
  manager?: number;
  organization: number;
  sites?: number[];
  modalities?: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
  documentation_url: boolean;
};
export type OrganizationUpsertUser = {
  id?: number;
  memberships: UpsertUser[];
};
export type ProductCreate = {
  id?: number;
  name: string;
  manufacturer: number;
};
export type ProductModelCreate = {
  id?: number;
  model: string;
  documentation: Documentation;
  modality: number;
  product: number;
};
export type SystemImage = {
  id?: number;
  image: string;
};
export type SystemNotes = {
  id?: number;
  author: number;
  note: string;
  created_at?: string;
  author_image?: string;
  author_full_name?: string;
};
export type UserEnableDisable = {
  users: number[];
};
export type Category = {
  id?: number;
  name: string;
};
export type Document = {
  id?: number;
  text: string;
  folder: number;
  created_by?: number | null;
};
export type Folder = {
  id?: number;
  name: string;
  categories: number[];
  no_of_documents?: number;
};
export const {
  useAccountsRequestsCreateMutation,
  useHealthNetworksListQuery,
  useLambdaPartialUpdateMutation,
  useManufacturersListQuery,
  useManufacturersCreateMutation,
  useManufacturersImagesListQuery,
  useManufacturersImagesCreateMutation,
  useModalitiesManufacturersListQuery,
  useNotesPartialUpdateMutation,
  useNotesDeleteMutation,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsExistsReadQuery,
  useOrganizationsReadQuery,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsAssociatedSitesListQuery,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsHealthNetworksUpdateMutation,
  useOrganizationsMeReadQuery,
  useOrganizationsModalitiesListQuery,
  useOrganizationsSeatsListQuery,
  useOrganizationsSeatsCreateMutation,
  useOrganizationsSitesListQuery,
  useOrganizationsSitesCreateMutation,
  useOrganizationsSitesUpdateMutation,
  useOrganizationsSystemsListQuery,
  useOrganizationsSystemsCreateMutation,
  useOrganizationsSystemsReadQuery,
  useOrganizationsSystemsPartialUpdateMutation,
  useOrganizationsSystemsDeleteMutation,
  useOrganizationsUsersListQuery,
  useOrganizationsUsersCreateMutation,
  useProductsListQuery,
  useProductsCreateMutation,
  useProductsModelsListQuery,
  useProductsModelsCreateMutation,
  useProductsModelsPartialUpdateMutation,
  useProductsModelsDeleteMutation,
  useProductsPartialUpdateMutation,
  useProductsDeleteMutation,
  useSystemsImagesListQuery,
  useSystemsImagesCreateMutation,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useUsersActivatePartialUpdateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersRolesListQuery,
  useUsersPartialUpdateMutation,
  useVfseCategoriesListQuery,
  useVfseDocumentsListQuery,
  useVfseDocumentsCreateMutation,
  useVfseDocumentsPartialUpdateMutation,
  useVfseDocumentsDeleteMutation,
  useVfseFoldersListQuery,
  useVfseFoldersCreateMutation,
  useVfseFoldersPartialUpdateMutation,
  useVfseFoldersDeleteMutation,
} = injectedRtkApi;
