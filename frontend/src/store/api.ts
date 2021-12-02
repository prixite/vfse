import { emptyApi as api } from "@src/store/emptyApi";
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
    meRead: build.query<MeReadApiResponse, MeReadApiArg>({
      query: () => ({ url: `/me/` }),
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
    organizationsHealthNetworksList: build.query<
      OrganizationsHealthNetworksListApiResponse,
      OrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.organizationPk}/health_networks/`,
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
    sitesSystemsList: build.query<
      SitesSystemsListApiResponse,
      SitesSystemsListApiArg
    >({
      query: (queryArg) => ({ url: `/sites/${queryArg.sitePk}/systems/` }),
    }),
    usersList: build.query<UsersListApiResponse, UsersListApiArg>({
      query: () => ({ url: `/users/` }),
    }),
    usersCreate: build.mutation<UsersCreateApiResponse, UsersCreateApiArg>({
      query: (queryArg) => ({
        url: `/users/`,
        method: "POST",
        body: queryArg.user,
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
export type MeReadApiResponse = /** status 200  */ Me;
export type MeReadApiArg = void;
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
export type OrganizationsHealthNetworksListApiResponse =
  /** status 200  */ HealthNetwork[];
export type OrganizationsHealthNetworksListApiArg = {
  organizationPk: string;
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
export type SitesSystemsListApiResponse = /** status 200  */ System[];
export type SitesSystemsListApiArg = {
  sitePk: string;
};
export type UsersListApiResponse = /** status 200  */ User[];
export type UsersListApiArg = void;
export type UsersCreateApiResponse = /** status 201  */ User;
export type UsersCreateApiArg = {
  user: User;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  logo?: string | null;
};
export type Appearance = {
  color_one: string;
  color_two: string;
  color_three: string;
  font_one: string;
  font_two: string;
};
export type Organization = {
  id?: number;
  name: string;
  logo?: string | null;
  background_color?: string;
  banner?: string | null;
  number_of_seats?: number | null;
  is_default?: boolean;
  appearance?: Appearance;
};
export type Me = {
  first_name?: string;
  last_name?: string;
  flags?: string;
  organization?: Organization;
};
export type Site = {
  name: string;
  address: string;
};
export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username: string;
};
export type System = {
  modality: number;
  product: number;
  image?: number | null;
  software_version: string;
  asset_number: string;
  ip_address: string;
  local_ae_title: string;
};
export const {
  useHealthNetworkListQuery,
  useHealthNetworkCreateMutation,
  useMeReadQuery,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksSitesListQuery,
  useOrganizationsUsersListQuery,
  useOrganizationsVfseSystemsListQuery,
  useSitesSystemsListQuery,
  useUsersListQuery,
  useUsersCreateMutation,
} = injectedRtkApi;
