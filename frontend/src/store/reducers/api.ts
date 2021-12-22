import { emptySplitApi as api } from "@src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    accountsRequestCreate: build.mutation<
      AccountsRequestCreateApiResponse,
      AccountsRequestCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/accounts/request/`,
        method: "POST",
        body: queryArg.userRequestAcessSeriazlizer,
      }),
    }),
    apiManufacturersList: build.query<
      ApiManufacturersListApiResponse,
      ApiManufacturersListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/manufacturers/`,
        params: { page: queryArg.page },
      }),
    }),
    apiManufacturersCreate: build.mutation<
      ApiManufacturersCreateApiResponse,
      ApiManufacturersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/manufacturers/`,
        method: "POST",
        body: queryArg.manufacturer,
      }),
    }),
    apiManufacturersImagesList: build.query<
      ApiManufacturersImagesListApiResponse,
      ApiManufacturersImagesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/manufacturers/images/`,
        params: { page: queryArg.page },
      }),
    }),
    apiManufacturersImagesCreate: build.mutation<
      ApiManufacturersImagesCreateApiResponse,
      ApiManufacturersImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/manufacturers/images/`,
        method: "POST",
        body: queryArg.manufacturerImage,
      }),
    }),
    apiMeRead: build.query<ApiMeReadApiResponse, ApiMeReadApiArg>({
      query: () => ({ url: `/api/me/` }),
    }),
    apiModalitiesList: build.query<
      ApiModalitiesListApiResponse,
      ApiModalitiesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/modalities/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsList: build.query<
      ApiOrganizationsListApiResponse,
      ApiOrganizationsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsCreate: build.mutation<
      ApiOrganizationsCreateApiResponse,
      ApiOrganizationsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/`,
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
        url: `/api/organizations/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.organization,
      }),
    }),
    apiOrganizationsDelete: build.mutation<
      ApiOrganizationsDeleteApiResponse,
      ApiOrganizationsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    apiOrganizationsHealthNetworksList: build.query<
      ApiOrganizationsHealthNetworksListApiResponse,
      ApiOrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/health_networks/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsHealthNetworksCreate: build.mutation<
      ApiOrganizationsHealthNetworksCreateApiResponse,
      ApiOrganizationsHealthNetworksCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/health_networks/`,
        method: "POST",
        body: queryArg.organizationHealthNetworkCreate,
      }),
    }),
    apiOrganizationsSeatsList: build.query<
      ApiOrganizationsSeatsListApiResponse,
      ApiOrganizationsSeatsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/seats/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsSeatsCreate: build.mutation<
      ApiOrganizationsSeatsCreateApiResponse,
      ApiOrganizationsSeatsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/seats/`,
        method: "POST",
        body: queryArg.systemSeatSeriazlier,
      }),
    }),
    apiOrganizationsSitesList: build.query<
      ApiOrganizationsSitesListApiResponse,
      ApiOrganizationsSitesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/sites/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsUsersList: build.query<
      ApiOrganizationsUsersListApiResponse,
      ApiOrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/users/`,
        params: { page: queryArg.page },
      }),
    }),
    apiOrganizationsUsersCreate: build.mutation<
      ApiOrganizationsUsersCreateApiResponse,
      ApiOrganizationsUsersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/organizations/${queryArg.organizationPk}/users/`,
        method: "POST",
        body: queryArg.upsertUser,
      }),
    }),
    apiProductsModelsList: build.query<
      ApiProductsModelsListApiResponse,
      ApiProductsModelsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/models/`,
        params: { page: queryArg.page },
      }),
    }),
    apiProductsModelsPartialUpdate: build.mutation<
      ApiProductsModelsPartialUpdateApiResponse,
      ApiProductsModelsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/models/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.productModel,
      }),
    }),
    apiSitesSystemsList: build.query<
      ApiSitesSystemsListApiResponse,
      ApiSitesSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/sites/${queryArg.sitePk}/systems/`,
        params: { page: queryArg.page },
      }),
    }),
    apiSystemsImagesList: build.query<
      ApiSystemsImagesListApiResponse,
      ApiSystemsImagesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/systems/images/`,
        params: { page: queryArg.page },
      }),
    }),
    apiSystemsImagesCreate: build.mutation<
      ApiSystemsImagesCreateApiResponse,
      ApiSystemsImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/systems/images/`,
        method: "POST",
        body: queryArg.systemImage,
      }),
    }),
    apiSystemsNotesList: build.query<
      ApiSystemsNotesListApiResponse,
      ApiSystemsNotesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/systems/${queryArg.systemId}/notes/`,
        params: { page: queryArg.page },
      }),
    }),
    apiSystemsNotesCreate: build.mutation<
      ApiSystemsNotesCreateApiResponse,
      ApiSystemsNotesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/systems/${queryArg.systemId}/notes/`,
        method: "POST",
        body: queryArg.systemNotes,
      }),
    }),
    apiUsersDeactivatePartialUpdate: build.mutation<
      ApiUsersDeactivatePartialUpdateApiResponse,
      ApiUsersDeactivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/deactivate/`,
        method: "PATCH",
        body: queryArg.userDeactivate,
      }),
    }),
    apiUsersPartialUpdate: build.mutation<
      ApiUsersPartialUpdateApiResponse,
      ApiUsersPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.upsertUser,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type AccountsRequestCreateApiResponse =
  /** status 201  */ UserRequestAcessSeriazlizer;
export type AccountsRequestCreateApiArg = {
  userRequestAcessSeriazlizer: UserRequestAcessSeriazlizer;
};
export type ApiManufacturersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Manufacturer[];
};
export type ApiManufacturersListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ApiManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type ApiManufacturersImagesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ManufacturerImage[];
};
export type ApiManufacturersImagesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiManufacturersImagesCreateApiResponse =
  /** status 201  */ ManufacturerImage;
export type ApiManufacturersImagesCreateApiArg = {
  manufacturerImage: ManufacturerImage;
};
export type ApiMeReadApiResponse = /** status 200  */ Me;
export type ApiMeReadApiArg = void;
export type ApiModalitiesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Modality[];
};
export type ApiModalitiesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Organization[];
};
export type ApiOrganizationsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsCreateApiResponse = /** status 201  */ Organization;
export type ApiOrganizationsCreateApiArg = {
  organization: Organization;
};
export type OrganizationsReadApiResponse = /** status 200  */ Organization;
export type OrganizationsReadApiArg = {
  id: string;
};
export type OrganizationsPartialUpdateApiResponse =
  /** status 200  */ Organization;
export type ApiOrganizationsPartialUpdateApiArg = {
  id: string;
  organization: Organization;
};
export type ApiOrganizationsDeleteApiResponse = unknown;
export type ApiOrganizationsDeleteApiArg = {
  id: string;
};
export type ApiOrganizationsHealthNetworksListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: HealthNetwork[];
};
export type ApiOrganizationsHealthNetworksListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsHealthNetworksCreateApiResponse =
  /** status 201  */ OrganizationHealthNetworkCreate;
export type ApiOrganizationsHealthNetworksCreateApiArg = {
  organizationPk: string;
  organizationHealthNetworkCreate: OrganizationHealthNetworkCreate;
};
export type ApiOrganizationsSeatsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Seat[];
};
export type ApiOrganizationsSeatsListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsSeatsCreateApiResponse =
  /** status 201  */ SystemSeatSeriazlier;
export type ApiOrganizationsSeatsCreateApiArg = {
  organizationPk: string;
  systemSeatSeriazlier: SystemSeatSeriazlier;
};
export type ApiOrganizationsSitesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Site[];
};
export type ApiOrganizationsSitesListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsUsersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: User[];
};
export type ApiOrganizationsUsersListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiOrganizationsUsersCreateApiResponse =
  /** status 201  */ UpsertUser;
export type ApiOrganizationsUsersCreateApiArg = {
  organizationPk: string;
  upsertUser: UpsertUser;
};
export type ApiProductsModelsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ProductModel[];
};
export type ApiProductsModelsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiProductsModelsPartialUpdateApiResponse =
  /** status 200  */ ProductModel;
export type ApiProductsModelsPartialUpdateApiArg = {
  id: string;
  productModel: ProductModel;
};
export type ApiSitesSystemsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: System[];
};
export type ApiSitesSystemsListApiArg = {
  sitePk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiSystemsImagesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SystemImage[];
};
export type ApiSystemsImagesListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiSystemsImagesCreateApiResponse = /** status 201  */ SystemImage;
export type ApiSystemsImagesCreateApiArg = {
  systemImage: SystemImage;
};
export type ApiSystemsNotesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SystemNotes[];
};
export type ApiSystemsNotesListApiArg = {
  systemId: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ApiSystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type ApiSystemsNotesCreateApiArg = {
  systemId: string;
  systemNotes: SystemNotes;
};
export type ApiUsersDeactivatePartialUpdateApiResponse =
  /** status 200  */ UserDeactivate;
export type ApiUsersDeactivatePartialUpdateApiArg = {
  userDeactivate: UserDeactivate;
};
export type ApiUsersPartialUpdateApiResponse = /** status 200  */ UpsertUser;
export type ApiUsersPartialUpdateApiArg = {
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
  logo: string;
  banner: string;
  icon: string;
};
export type Site = {
  id?: number;
  name: string;
  address: string;
};
export type Organization = {
  id?: number;
  name: string;
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
  appearance?: object;
  sites?: Site[];
};
export type OrganizationHealthNetworkCreate = {
  health_networks: number[];
};
export type Seat = {
  system: number;
  organization: number;
};
export type SystemSeatSeriazlier = {
  ids: number[];
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
  useOrganizationsReadQuery,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsSeatsListQuery,
  useOrganizationsSeatsCreateMutation,
  useOrganizationsSitesListQuery,
  useOrganizationsUsersListQuery,
  useOrganizationsUsersCreateMutation,
  useProductsModelsListQuery,
  useProductsModelsPartialUpdateMutation,
  useSitesSystemsListQuery,
  useSystemsImagesListQuery,
  useSystemsImagesCreateMutation,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersPartialUpdateMutation,
} = injectedRtkApi;
