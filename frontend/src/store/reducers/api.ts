import { emptySplitApi as api } from "@src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    healthNetworkList: build.query<
      HealthNetworkListApiResponse,
      HealthNetworkListApiArg
    >({
      query: () => ({ url: `/health_network/` }),
    }),
    healthNetworkCreate: build.mutation<
      HealthNetworkCreateApiResponse,
      HealthNetworkCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/health_network/`,
        method: "POST",
        body: queryArg.healthNetwork,
      }),
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
    meRead: build.query<MeReadApiResponse, MeReadApiArg>({
      query: () => ({ url: `/me/` }),
    }),
    modalitiesList: build.query<
      ModalitiesListApiResponse,
      ModalitiesListApiArg
    >({
      query: () => ({ url: `/modalities/` }),
    }),
    organizationsList: build.query<
      OrganizationsListApiResponse,
      OrganizationsListApiArg
    >({
      query: () => ({ url: `/organizations/` }),
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
    organizationsChildrenList: build.query<
      OrganizationsChildrenListApiResponse,
      OrganizationsChildrenListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/children/` }),
    }),
    organizationsChildrenCreate: build.mutation<
      OrganizationsChildrenCreateApiResponse,
      OrganizationsChildrenCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/children/`,
        method: "POST",
        body: queryArg.organizationChildren,
      }),
    }),
    organizationsHealthNetworksList: build.query<
      OrganizationsHealthNetworksListApiResponse,
      OrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
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
    organizationsHealthNetworksSitesList: build.query<
      OrganizationsHealthNetworksSitesListApiResponse,
      OrganizationsHealthNetworksSitesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/health_networks/${queryArg.healthNetworkPk}/sites/`,
      }),
    }),
    organizationsUsersList: build.query<
      OrganizationsUsersListApiResponse,
      OrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/users/`,
      }),
    }),
    organizationsVfseSystemsList: build.query<
      OrganizationsVfseSystemsListApiResponse,
      OrganizationsVfseSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/vfse_systems/`,
      }),
    }),
    productsModelsList: build.query<
      ProductsModelsListApiResponse,
      ProductsModelsListApiArg
    >({
      query: () => ({ url: `/products/models/` }),
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
      query: (queryArg) => ({ url: `/sites/${queryArg.sitePk}/systems/` }),
    }),
    systemsNotesList: build.query<
      SystemsNotesListApiResponse,
      SystemsNotesListApiArg
    >({
      query: (queryArg) => ({ url: `/systems/${queryArg.systemId}/notes/` }),
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
      query: () => ({ url: `/users/` }),
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
export type HealthNetworkListApiResponse = /** status 200  */ HealthNetwork[];
export type HealthNetworkListApiArg = void;
export type HealthNetworkCreateApiResponse = /** status 201  */ HealthNetwork;
export type HealthNetworkCreateApiArg = {
  healthNetwork: HealthNetwork;
};
export type ManufacturersListApiResponse = /** status 200  */ Manufacturer[];
export type ManufacturersListApiArg = void;
export type ManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type MeReadApiResponse = /** status 200  */ Me;
export type MeReadApiArg = void;
export type ModalitiesListApiResponse = /** status 200  */ Modality[];
export type ModalitiesListApiArg = void;
export type OrganizationsListApiResponse = /** status 200  */ Organization[];
export type OrganizationsListApiArg = void;
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
export type OrganizationsChildrenListApiResponse =
  /** status 200  */ Organization[];
export type OrganizationsChildrenListApiArg = {
  id: string;
};
export type OrganizationsChildrenCreateApiResponse =
  /** status 201  */ OrganizationChildren;
export type OrganizationsChildrenCreateApiArg = {
  id: string;
  organizationChildren: OrganizationChildren;
};
export type OrganizationsHealthNetworksListApiResponse =
  /** status 200  */ HealthNetwork[];
export type OrganizationsHealthNetworksListApiArg = {
  organizationPk: string;
};
export type OrganizationsHealthNetworksCreateApiResponse =
  /** status 201  */ OrganizationHealthNetworkCreate;
export type OrganizationsHealthNetworksCreateApiArg = {
  organizationPk: string;
  organizationHealthNetworkCreate: OrganizationHealthNetworkCreate;
};
export type OrganizationsHealthNetworksSitesListApiResponse =
  /** status 200  */ Site[];
export type OrganizationsHealthNetworksSitesListApiArg = {
  healthNetworkPk: string;
  organizationPk: string;
};
export type OrganizationsUsersListApiResponse = /** status 200  */ User[];
export type OrganizationsUsersListApiArg = {
  organizationPk: string;
};
export type OrganizationsVfseSystemsListApiResponse =
  /** status 200  */ System[];
export type OrganizationsVfseSystemsListApiArg = {
  organizationPk: string;
};
export type ProductsModelsListApiResponse = /** status 200  */ ProductModel[];
export type ProductsModelsListApiArg = void;
export type ProductsModelsPartialUpdateApiResponse =
  /** status 200  */ ProductModel;
export type ProductsModelsPartialUpdateApiArg = {
  id: string;
  productModel: ProductModel;
};
export type SitesSystemsListApiResponse = /** status 200  */ System[];
export type SitesSystemsListApiArg = {
  sitePk: string;
};
export type SystemsNotesListApiResponse = /** status 200  */ SystemNotes[];
export type SystemsNotesListApiArg = {
  systemId: string;
};
export type SystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type SystemsNotesCreateApiArg = {
  systemId: string;
  systemNotes: SystemNotes;
};
export type UsersListApiResponse = /** status 200  */ User[];
export type UsersListApiArg = void;
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
export type Site = {
  id?: number;
  name: string;
  address: string;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  logo?: string | null;
  sites: Site[];
};
export type Manufacturer = {
  name: string;
  image?: number | null;
};
export type Appearance = {
  sidebar_text: string;
  button_text: string;
  sidebar_color: string;
  primary_color: string;
  font_one: string;
  font_two: string;
};
export type Organization = {
  id?: number;
  name: string;
  logo?: string | null;
  banner?: string | null;
  number_of_seats?: number | null;
  is_default?: boolean;
  appearance?: Appearance;
  parent?: number | null;
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
export type OrganizationChildren = {
  children: number[];
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
export type System = {
  site: number;
  product_model: number;
  image?: number | null;
  software_version: string;
  asset_number: string;
  ip_address: string;
  local_ae_title: string;
};
export type ProductModel = {
  id?: number;
  product: number;
  modality: number;
  documentation?: number | null;
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
  useHealthNetworkListQuery,
  useHealthNetworkCreateMutation,
  useManufacturersListQuery,
  useManufacturersCreateMutation,
  useMeReadQuery,
  useModalitiesListQuery,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsChildrenListQuery,
  useOrganizationsChildrenCreateMutation,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsHealthNetworksSitesListQuery,
  useOrganizationsUsersListQuery,
  useOrganizationsVfseSystemsListQuery,
  useProductsModelsListQuery,
  useProductsModelsPartialUpdateMutation,
  useSitesSystemsListQuery,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useUsersListQuery,
  useUsersCreateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersPartialUpdateMutation,
} = injectedRtkApi;
