import { emptySplitApi as api } from "@src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
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
        params: { page: queryArg.page },
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
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
        params: { page: queryArg.page },
      }),
    }),
    organizationsHealthNetworksCreate: build.mutation<
      OrganizationsHealthNetworksCreateApiResponse,
      OrganizationsHealthNetworksCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
        method: "POST",
        body: queryArg.organizationHealthNetworkCreate,
      }),
    }),
    organizationsSeatsList: build.query<
      OrganizationsSeatsListApiResponse,
      OrganizationsSeatsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/seats/`,
        params: { page: queryArg.page },
      }),
    }),
    organizationsSeatsCreate: build.mutation<
      OrganizationsSeatsCreateApiResponse,
      OrganizationsSeatsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/seats/`,
        method: "POST",
      }),
    }),
    organizationsSitesList: build.query<
      OrganizationsSitesListApiResponse,
      OrganizationsSitesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/sites/`,
        params: { page: queryArg.page },
      }),
    }),
    organizationsUsersList: build.query<
      OrganizationsUsersListApiResponse,
      OrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/users/`,
        params: { page: queryArg.page },
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
    sitesSystemsList: build.query<
      SitesSystemsListApiResponse,
      SitesSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/sites/${queryArg.sitePk}/systems/`,
        params: { page: queryArg.page },
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
        url: `/systems/${queryArg.systemId}/notes/`,
        params: { page: queryArg.page },
      }),
    }),
    systemsNotesCreate: build.mutation<
      SystemsNotesCreateApiResponse,
      SystemsNotesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/${queryArg.systemId}/notes/`,
        method: "POST",
        body: queryArg.systemNotes,
      }),
    }),
    usersList: build.query<UsersListApiResponse, UsersListApiArg>({
      query: (queryArg) => ({
        url: `/users/`,
        params: { page: queryArg.page },
      }),
    }),
    usersCreate: build.mutation<UsersCreateApiResponse, UsersCreateApiArg>({
      query: (queryArg) => ({
        url: `/users/`,
        method: "POST",
        body: queryArg.upsertUser,
      }),
    }),
    usersDeactivatePartialUpdate: build.mutation<
      UsersDeactivatePartialUpdateApiResponse,
      UsersDeactivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/deactivate/`,
        method: "PATCH",
        body: queryArg.userDeactivate,
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
export type ManufacturersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Manufacturer[];
};
export type ManufacturersListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type ManufacturersImagesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ManufacturerImage[];
};
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
export type ModalitiesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Modality[];
};
export type ModalitiesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Organization[];
};
export type OrganizationsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsCreateApiResponse = /** status 201  */ Organization;
export type OrganizationsCreateApiArg = {
  organization: Organization;
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
export type OrganizationsHealthNetworksListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: HealthNetwork[];
};
export type OrganizationsHealthNetworksListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsHealthNetworksCreateApiResponse =
  /** status 201  */ OrganizationHealthNetworkCreate;
export type OrganizationsHealthNetworksCreateApiArg = {
  organizationPk: string;
  organizationHealthNetworkCreate: OrganizationHealthNetworkCreate;
};
export type OrganizationsSeatsListApiResponse = unknown;
export type OrganizationsSeatsListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsSeatsCreateApiResponse = unknown;
export type OrganizationsSeatsCreateApiArg = {
  organizationPk: string;
};
export type OrganizationsSitesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Site[];
};
export type OrganizationsSitesListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsUsersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: User[];
};
export type OrganizationsUsersListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ProductsModelsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ProductModel[];
};
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
export type SitesSystemsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: System[];
};
export type SitesSystemsListApiArg = {
  sitePk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SystemsImagesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SystemImage[];
};
export type SystemsImagesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type SystemsImagesCreateApiResponse = /** status 201  */ SystemImage;
export type SystemsImagesCreateApiArg = {
  systemImage: SystemImage;
};
export type SystemsNotesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SystemNotes[];
};
export type SystemsNotesListApiArg = {
  systemId: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type SystemsNotesCreateApiArg = {
  systemId: string;
  systemNotes: SystemNotes;
};
export type UsersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: User[];
};
export type UsersListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type UsersCreateApiResponse = /** status 201  */ UpsertUser;
export type UsersCreateApiArg = {
  upsertUser: UpsertUser;
};
export type UsersDeactivatePartialUpdateApiResponse =
  /** status 200  */ UserDeactivate;
export type UsersDeactivatePartialUpdateApiArg = {
  userDeactivate: UserDeactivate;
};
export type UsersPartialUpdateApiResponse = /** status 200  */ UpsertUser;
export type UsersPartialUpdateApiArg = {
  id: string;
  upsertUser: UpsertUser;
};
export type Manufacturer = {
  name: string;
  image?: number | null;
};
export type ManufacturerImage = {
  image?: string | null;
};
export type Appearance = {
  sidebar_text: string;
  button_text: string;
  sidebar_color: string;
  primary_color: string;
  font_one: string;
  font_two: string;
};
export type Site = {
  id?: number;
  name: string;
  address: string;
};
export type Organization = {
  id?: number;
  name: string;
  logo?: string | null;
  banner?: string | null;
  number_of_seats?: number | null;
  appearance?: Appearance;
  sites?: Site[];
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
export type HealthNetwork = {
  id?: number;
  name: string;
  logo?: string | null;
  banner?: string | null;
  sites?: Site[];
};
export type OrganizationHealthNetworkCreate = {
  health_networks: number[];
};
export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username: string;
  is_active?: boolean;
};
export type ProductModel = {
  id?: number;
  product: number;
  modality: number;
  documentation?: number | null;
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
export type UpsertUser = {
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
export type UserDeactivate = {
  users: number[];
};
export const {
  useManufacturersListQuery,
  useManufacturersCreateMutation,
  useManufacturersImagesListQuery,
  useManufacturersImagesCreateMutation,
  useMeReadQuery,
  useModalitiesListQuery,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsSeatsListQuery,
  useOrganizationsSeatsCreateMutation,
  useOrganizationsSitesListQuery,
  useOrganizationsUsersListQuery,
  useProductsModelsListQuery,
  useProductsModelsPartialUpdateMutation,
  useSitesSystemsListQuery,
  useSystemsImagesListQuery,
  useSystemsImagesCreateMutation,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useUsersListQuery,
  useUsersCreateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersPartialUpdateMutation,
} = injectedRtkApi;
