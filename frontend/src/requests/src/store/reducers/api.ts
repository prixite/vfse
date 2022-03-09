import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  Organization,
  Role,
  User,
  UserRequestAccess,
} from "@src/store/reducers/generated";

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
    sendAccessRequest: builder.mutation<
      UserRequestAccess,
      { data: UserRequestAccess }
    >({
      query: ({ data }) => ({
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
} = api;
export default api;
