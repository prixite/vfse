import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    getMe: builder.query<Me, void>({
      query: () => ({ url: "/api/me/", method: "get" }),
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
