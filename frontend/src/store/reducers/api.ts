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
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
        params: { page: queryArg.page },
      }),
    }),
    organizationsHealthNetworksUpdate: build.mutation<
      OrganizationsHealthNetworksUpdateApiResponse,
      OrganizationsHealthNetworksUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
        method: "PUT",
        body: queryArg.healthNetwork,
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
        body: queryArg.systemSeatSeriazlier,
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
    organizationsUsersCreate: build.mutation<
      OrganizationsUsersCreateApiResponse,
      OrganizationsUsersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/users/`,
        method: "POST",
        body: queryArg.upsertUser,
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
export type AccountsRequestsCreateApiResponse =
  /** status 201  */ UserRequestAcessSeriazlizer;
export type AccountsRequestsCreateApiArg = {
  userRequestAcessSeriazlizer: UserRequestAcessSeriazlizer;
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
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsHealthNetworksUpdateApiResponse =
  /** status 200  */ HealthNetwork;
export type OrganizationsHealthNetworksUpdateApiArg = {
  organizationPk: string;
  healthNetwork: HealthNetwork;
};
export type OrganizationsSeatsListApiResponse = /** status 200  */ Seat[];
export type OrganizationsSeatsListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsSeatsCreateApiResponse =
  /** status 201  */ SystemSeatSeriazlier;
export type OrganizationsSeatsCreateApiArg = {
  organizationPk: string;
  systemSeatSeriazlier: SystemSeatSeriazlier;
};
export type OrganizationsSitesListApiResponse = /** status 200  */ Site[];
export type OrganizationsSitesListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsUsersListApiResponse = /** status 200  */ User[];
export type OrganizationsUsersListApiArg = {
  organizationPk: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type OrganizationsUsersCreateApiResponse = /** status 201  */ UpsertUser;
export type OrganizationsUsersCreateApiArg = {
  organizationPk: string;
  upsertUser: UpsertUser;
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
export type SitesSystemsListApiResponse = /** status 200  */ System[];
export type SitesSystemsListApiArg = {
  sitePk: string;
  /** A page number within the paginated result set. */
  page?: number;
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
  systemId: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type SystemsNotesCreateApiArg = {
  systemId: string;
  systemNotes: SystemNotes;
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
export type Appearance2 = {
  logo: string;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  appearance?: Appearance2;
  sites?: Site[];
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
  useAccountsRequestsCreateMutation,
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
  useOrganizationsHealthNetworksUpdateMutation,
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
