import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Organization } from "@src/store/reducers/generated";

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
  tagTypes: ["Organization", "Role", "Me"],
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organization[], void>({
      query: () => ({ url: "/api/organizations/", method: "get" }),
      providesTags: ["Organization"],
    }),
    getRoles: builder.query<void, void>({
      query: () => ({ url: "/api/users/roles/", method: "get" }),
      providesTags: ["Role"],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/api/me/",
        method: "delete",
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export default api;
