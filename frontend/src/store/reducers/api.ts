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
        params: { name: queryArg.name, page: queryArg.page },
      }),
    }),
    manufacturersList: build.query<
      ManufacturersListApiResponse,
      ManufacturersListApiArg
    >({
      query: (queryArg) => ({
        url: `/manufacturers/`,
        params: { page: queryArg.page },
      }),
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
      query: (queryArg) => ({
        url: `/manufacturers/images/`,
        params: { page: queryArg.page },
      }),
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
    meRead: build.query<MeReadApiResponse, MeReadApiArg>({
      query: () => ({ url: `/me/` }),
    }),
    modalitiesList: build.query<
      ModalitiesListApiResponse,
      ModalitiesListApiArg
    >({
      query: (queryArg) => ({
        url: `/modalities/`,
        params: { page: queryArg.page },
      }),
    }),
    organizationsList: build.query<
      OrganizationsListApiResponse,
      OrganizationsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/`,
        params: { name: queryArg.name, page: queryArg.page },
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
    organizationsHealthNetworksList: build.query<
      OrganizationsHealthNetworksListApiResponse,
      OrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
        params: { page: queryArg.page },
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
    organizationsSeatsList: build.query<
      OrganizationsSeatsListApiResponse,
      OrganizationsSeatsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/seats/`,
        params: { page: queryArg.page },
      }),
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
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/sites/`,
        params: { page: queryArg.page },
      }),
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
    organizationsUsersList: build.query<
      OrganizationsUsersListApiResponse,
      OrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/users/`,
        params: { page: queryArg.page },
      }),
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
        params: { page: queryArg.page },
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
        params: { page: queryArg.page },
      }),
    }),
    productsModelsPartialUpdate: build.mutation<
      ProductsModelsPartialUpdateApiResponse,
      ProductsModelsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.productModel,
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
    sitesSystemsList: build.query<
      SitesSystemsListApiResponse,
      SitesSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/sites/${queryArg.id}/systems/`,
        params: { page: queryArg.page },
      }),
    }),
    sitesSystemsCreate: build.mutation<
      SitesSystemsCreateApiResponse,
      SitesSystemsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/sites/${queryArg.id}/systems/`,
        method: "POST",
        body: queryArg.system,
      }),
    }),
    sitesSystemsPartialUpdate: build.mutation<
      SitesSystemsPartialUpdateApiResponse,
      SitesSystemsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/sites/${queryArg.id}/systems/${queryArg.systemId}/`,
        method: "PATCH",
        body: queryArg.system,
      }),
    }),
    sitesSystemsDelete: build.mutation<
      SitesSystemsDeleteApiResponse,
      SitesSystemsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/sites/${queryArg.id}/systems/${queryArg.systemId}/`,
        method: "DELETE",
      }),
    }),
    systemsImagesList: build.query<
      SystemsImagesListApiResponse,
      SystemsImagesListApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/images/`,
        params: { page: queryArg.page },
      }),
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
      query: (queryArg) => ({
        url: `/systems/${queryArg.id}/notes/`,
        params: { page: queryArg.page },
      }),
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
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type AccountsRequestsCreateApiResponse =
  /** status 201  */ UserRequestAcessSeriazlizer;
export type AccountsRequestsCreateApiArg = {
  userRequestAcessSeriazlizer: UserRequestAcessSeriazlizer;
};
export type HealthNetworksListApiResponse = /** status 200  */ HealthNetwork[];
export type HealthNetworksListApiArg = {
  name?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ManufacturersListApiResponse = /** status 200  */ Manufacturer[];
export type ManufacturersListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type ManufacturersImagesListApiResponse =
  /** status 200  */ ManufacturerImage[];
export type ManufacturersImagesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ManufacturersImagesCreateApiResponse =
  /** status 201  */ ManufacturerImage;
export type ManufacturersImagesCreateApiArg = {
  manufacturerImage: ManufacturerImage;
};
export type MeReadApiResponse = /** status 200  */ Me;
export type MeReadApiArg = void;
export type ModalitiesListApiResponse = /** status 200  */ Modality[];
export type ModalitiesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsListApiResponse = /** status 200  */ Organization[];
export type OrganizationsListApiArg = {
  name?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsCreateApiResponse = /** status 201  */ Organization;
export type OrganizationsCreateApiArg = {
  organization: Organization;
};
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
export type OrganizationsHealthNetworksListApiResponse =
  /** status 200  */ HealthNetwork[];
export type OrganizationsHealthNetworksListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
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
export type OrganizationsSeatsListApiResponse = /** status 200  */ Seat[];
export type OrganizationsSeatsListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
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
  /** A page number within the paginated result set. */
  page?: number;
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
export type OrganizationsUsersListApiResponse = /** status 200  */ User[];
export type OrganizationsUsersListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsUsersCreateApiResponse =
  /** status 201  */ OrganizationUpsertUser;
export type OrganizationsUsersCreateApiArg = {
  id: string;
  organizationUpsertUser: OrganizationUpsertUser;
};
export type ProductsListApiResponse = /** status 200  */ Product[];
export type ProductsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ProductsCreateApiResponse = /** status 201  */ ProductCreate;
export type ProductsCreateApiArg = {
  productCreate: ProductCreate;
};
export type ProductsModelsListApiResponse = /** status 200  */ ProductModel[];
export type ProductsModelsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ProductsModelsPartialUpdateApiResponse =
  /** status 200  */ ProductModel;
export type ProductsModelsPartialUpdateApiArg = {
  id: string;
  productModel: ProductModel;
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
export type SitesSystemsListApiResponse = /** status 200  */ System[];
export type SitesSystemsListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SitesSystemsCreateApiResponse = /** status 201  */ System;
export type SitesSystemsCreateApiArg = {
  id: string;
  system: System;
};
export type SitesSystemsPartialUpdateApiResponse = /** status 200  */ System;
export type SitesSystemsPartialUpdateApiArg = {
  id: string;
  systemId: string;
  system: System;
};
export type SitesSystemsDeleteApiResponse = unknown;
export type SitesSystemsDeleteApiArg = {
  id: string;
  systemId: string;
};
export type SystemsImagesListApiResponse = /** status 200  */ SystemImage[];
export type SystemsImagesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type SystemsImagesCreateApiResponse = /** status 201  */ SystemImage;
export type SystemsImagesCreateApiArg = {
  systemImage: SystemImage;
};
export type SystemsNotesListApiResponse = /** status 200  */ SystemNotes[];
export type SystemsNotesListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
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
export type UsersPartialUpdateApiResponse = /** status 200  */ UpsertUser;
export type UsersPartialUpdateApiArg = {
  id: string;
  upsertUser: UpsertUser;
};
export type Meta = {
  profile_picture: string;
  title: string;
};
export type UserRequestAcessSeriazlizer = {
  meta?: Meta;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?:
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
  manager: number;
  organization: number;
  sites: number[];
  modalities: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
  health_networks: number[];
};
export type Appearance = {
  logo: string;
};
export type MetaSite = {
  id?: number;
  name: string;
  address: string;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  appearance?: Appearance;
  sites?: MetaSite[];
};
export type Manufacturer = {
  name: string;
  image?: number | null;
};
export type ManufacturerImage = {
  image?: string | null;
};
export type Appearance2 = {
  sidebar_text: string;
  button_text: string;
  sidebar_color: string;
  primary_color: string;
  font_one: string;
  font_two: string;
  logo: string;
  banner: string;
  icon: string;
};
export type Organization = {
  id?: number;
  name: string;
  number_of_seats?: number | null;
  appearance?: Appearance2;
  sites?: MetaSite[];
};
export type Me = {
  first_name?: string;
  last_name?: string;
  flags?: string;
  organization?: Organization;
};
export type Modality = {
  name: string;
};
export type OrganizationHealthNetwork = {
  id?: number;
  health_networks: HealthNetwork[];
};
export type Seat = {
  system: number;
};
export type OrganizationSeatSeriazlier = {
  seats: Seat[];
};
export type Site = {
  id?: number;
  name: string;
  address: string;
  modalities?: string[];
};
export type OrganizationSite = {
  id?: number;
  sites: Site[];
};
export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username: string;
  is_active?: boolean;
};
export type UpsertUser = {
  meta?: Meta;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?:
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
  manager: number;
  organization: number;
  sites: number[];
  modalities: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
};
export type OrganizationUpsertUser = {
  id?: number;
  memberships: UpsertUser[];
};
export type Product = {
  id?: number;
  name: string;
  manufacturer: Manufacturer;
};
export type ProductCreate = {
  id?: number;
  name: string;
  manufacturer: number;
};
export type Documentation = {
  id?: number;
  url: string;
};
export type ProductModel = {
  id?: number;
  product: Product;
  modality: Modality;
  documentation: Documentation;
};
export type HisRisInfo = {
  ip: string;
  title: string;
  port: number;
  ae_title: string;
};
export type MriEmbeddedParameters = {
  helium: string;
  magnet_pressure: string;
};
export type System = {
  name: string;
  site: number;
  product_model: number;
  image?: number | null;
  software_version: string;
  asset_number: string;
  ip_address: string;
  local_ae_title: string;
  his_ris_info?: HisRisInfo;
  dicom_info?: HisRisInfo;
  mri_embedded_parameters?: MriEmbeddedParameters;
};
export type SystemImage = {
  image: string;
};
export type SystemNotes = {
  system: number;
  author: number;
  note: string;
  created_at?: string;
};
export type UserEnableDisable = {
  users: number[];
};
export const {
  useAccountsRequestsCreateMutation,
  useHealthNetworksListQuery,
  useManufacturersListQuery,
  useManufacturersCreateMutation,
  useManufacturersImagesListQuery,
  useManufacturersImagesCreateMutation,
  useMeReadQuery,
  useModalitiesListQuery,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsReadQuery,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsHealthNetworksUpdateMutation,
  useOrganizationsSeatsListQuery,
  useOrganizationsSeatsCreateMutation,
  useOrganizationsSitesListQuery,
  useOrganizationsSitesCreateMutation,
  useOrganizationsSitesUpdateMutation,
  useOrganizationsUsersListQuery,
  useOrganizationsUsersCreateMutation,
  useProductsListQuery,
  useProductsCreateMutation,
  useProductsModelsListQuery,
  useProductsModelsPartialUpdateMutation,
  useProductsPartialUpdateMutation,
  useProductsDeleteMutation,
  useSitesSystemsListQuery,
  useSitesSystemsCreateMutation,
  useSitesSystemsPartialUpdateMutation,
  useSitesSystemsDeleteMutation,
  useSystemsImagesListQuery,
  useSystemsImagesCreateMutation,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useUsersActivatePartialUpdateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersPartialUpdateMutation,
} = injectedRtkApi;
