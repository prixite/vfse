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
    getAllArticles: builder.query<Document[], void>({
      query: () => ({ url: `/vfse/documents/`, method: "get" }),
      providesTags: () => [{ type: "Article" }],
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
    addArticle: builder.mutation<Document, { document: Document }>({
      query: ({ document }) => ({
        url: "/vfse/documents/",
        method: "post",
        body: document,
      }),
      invalidatesTags: [{ type: "Article" }],
    }),
    deleteArticle: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/vfse/documents/${id}/`,
        method: "delete",
      }),
      invalidatesTags: ["Article"],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/vfse/categories/", method: "get" }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<Category, { category: Category }>({
      query: ({ category }) => ({
        url: "/vfse/categories/",
        method: "post",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: number; category: Category }
    >({
      query: ({ id, category }) => ({
        url: `/vfse/categories/${id}/`,
        method: "patch",
        data: category,
      }),
      invalidatesTags: ["Category"],
    }),
    getFolder: builder.query<Folder, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/folders/${id}/`, method: "get" }),
      providesTags: (result, error, { id }) => [{ type: "Folder", id: id }],
    }),
    getFolders: builder.query<Folder[], void>({
      query: () => ({ url: "/vfse/folders/", method: "get" }),
      providesTags: ["Folder"],
    }),
    updateFolder: builder.mutation<Folder, { id: number; folder: Folder }>({
      query: ({ id, folder }) => ({
        url: `/vfse/folders/${id}/`,
        method: "patch",
        data: folder,
      }),
      invalidatesTags: ["Folder"],
    }),
    addFolder: builder.mutation<Folder, { folder: Folder }>({
      query: ({ folder }) => ({
        url: "/vfse/folders/",
        method: "post",
        data: folder,
      }),
      invalidatesTags: ["Folder"],
    }),
    deleteFolder: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/vfse/folders/${id}/`,
        method: "delete",
      }),
      invalidatesTags: ["Folder"],
    }),
  }),
});
