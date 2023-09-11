import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  Organization,
  HealthNetwork,
  Role,
  User,
  UserRequestAccess,
  Site,
  Modality,
} from "@src/store/reducers/generatedWrapper";

const token = process.env.REQUEST_TOKEN;

const api = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Organization", "Role"],
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organization[], void>({
      query: () => ({ url: "/organizations/", method: "get" }),
      providesTags: ["Organization"],
    }),
    getRoles: builder.query<Role[], void>({
      query: () => ({ url: "/users/roles/", method: "get" }),
      providesTags: ["Role"],
    }),
    getManagers: builder.query<User[], { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: `/organizations/${organizationId}/users/`,
        method: "get",
      }),
      providesTags: (result, error, { organizationId }) => [
        { type: "Organization", id: `User-${organizationId}` },
      ],
    }),
    organizationsHealthNetworksList: builder.query<
      HealthNetwork[],
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `/organizations/${organizationId}/health_networks/`,
      }),
    }),
    organizationsSitesList: builder.query<Site[], { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: `/organizations/${organizationId}/sites/`,
      }),
    }),
    organizationsModalitiesList: builder.query<
      Modality[],
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `/organizations/${organizationId}/modalities/`,
      }),
    }),
    sendAccessRequest: builder.mutation<UserRequestAccess, UserRequestAccess>({
      query: (data) => ({
        url: `/accounts/requests/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetOrganizationsQuery,
  useGetRolesQuery,
  useGetManagersQuery,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
  useOrganizationsModalitiesListQuery,
} = api;
export default api;
