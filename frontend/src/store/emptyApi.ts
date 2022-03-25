import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Category, Document, Folder } from "./reducers/generated";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers) => {
      headers.append("Content-Type", "application/json");
      headers.set("X-CSRFToken", document.forms.csrf.csrfmiddlewaretoken.value);
      return headers;
    },
  }),
  tagTypes: ["Favorite", "Article", "Category", "Folder"],
  endpoints: (builder) => ({
    getTopArticles: builder.query<Document[], void>({
      query: () => ({ url: "/vfse/documents/?favorite=true", method: "get" }),
      providesTags: ["Favorite"],
    }),
    getArticle: builder.query<Document, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/documents/${id}/`, method: "get" }),
      providesTags: (result, error, { id }) => [{ type: "Article", id: id }],
    }),
    updateArticle: builder.mutation<
      Document,
      { id: number; document: Document }
    >({
      query: ({ id, document }) => ({
        url: `/vfse/documents/${id}/`,
        method: "patch",
        data: document,
      }),
      invalidatesTags: ["Article"],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: `/vfse/categories/`, method: "get" }),
      providesTags: ["Category"],
    }),
    getFolder: builder.query<Folder, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/folders/${id}/`, method: "get" }),
      providesTags: (result, error, { id }) => [{ type: "Folder", id: id }],
    }),
  }),
});
