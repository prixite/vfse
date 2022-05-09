import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  Category,
  Document,
  Folder,
  FolderDetail,
  VfseTopicsListApiResponse,
  VfseTopicsCreateApiResponse,
  VfseTopicsCreateApiArg,
  VfseTopicsReadApiResponse,
  VfseTopicsReadApiArg,
  WorkOrder,
  VfseTopicsPopularListApiResponse,
  VfseTopicsPopularListApiArg,
  VfseTopicsCommentsCreateApiResponse,
  VfseTopicsCommentsCreateApiArg,
  VfseTopicsCommentsListApiResponse,
  VfseTopicsCommentsListApiArg,
} from "@src/store/reducers/generated";
import { ChatBotResponse, getTopicListArg } from "@src/types/interfaces";

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
  tagTypes: ["Favorite", "Article", "Category", "Folder", "Topics", "Comment"],
  endpoints: (builder) => ({
    getPopularTopics: builder.query<
      VfseTopicsPopularListApiResponse,
      VfseTopicsPopularListApiArg
    >({
      query: () => ({
        url: `/vfse/topics/popular/`,
        method: "get",
      }),
      providesTags: ["Favorite"],
    }),

    updateTopics: builder.mutation<
      VfseTopicsListApiResponse,
      { title: string; description: string }
    >({
      query: ({ title, description }) => ({
        url: `/vfse/topics/`,
        method: "post",
        body: { title: title, description: description },
      }),
      invalidatesTags: ["Topics", "Favorite"],
    }),

    addTopic: builder.mutation<
      VfseTopicsCreateApiResponse,
      VfseTopicsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/`,
        method: "POST",
        body: queryArg.topic,
      }),
      invalidatesTags: ["Topics", "Favorite"],
    }),

    getTopicsList: builder.query<VfseTopicsListApiResponse, getTopicListArg>({
      query: (queryArg) => ({
        url: `/vfse/topics/`,
        params: { followed: queryArg.followed, created: queryArg.created },
      }),
      providesTags: ["Topics"],
    }),

    getTopic: builder.query<VfseTopicsReadApiResponse, VfseTopicsReadApiArg>({
      query: (queryArg) => ({ url: `/vfse/topics/${queryArg.id}/` }),
      providesTags: (result, error, queryArg) => [
        { type: "Comment", id: `Comment-${queryArg?.id}` },
        { type: "Topics" as const, id: `Topics-${queryArg.id}` },
      ],
    }),

    postChatBot: builder.mutation<
      ChatBotResponse,
      { sysId: number; query: string }
    >({
      query: ({ sysId, query }) => ({
        url: `/systems/${sysId}/chatbot/`,
        method: "post",
        body: { query: query },
      }),
    }),
    getTopArticles: builder.query<Document[], void>({
      query: () => ({ url: "/vfse/documents/?favorite=true", method: "get" }),
      providesTags: ["Favorite"],
    }),
    getArticle: builder.query<Document, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/documents/${id}/`, method: "get" }),
      providesTags: (result, _, { id }) => [{ type: "Article", id: id }],
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
        body: document,
      }),
      invalidatesTags: ["Article"],
    }),
    addArticle: builder.mutation<Document, { document: Document }>({
      query: ({ document }) => ({
        url: "/vfse/documents/",
        method: "post",
        body: document,
      }),
      invalidatesTags: [{ type: "Article" }, "Category"],
    }),
    deleteArticle: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/vfse/documents/${id}/`,
        method: "delete",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Article",
        { type: "Article", id: id },
      ],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/vfse/categories/", method: "get" }),
      providesTags: (result) => [
        "Category",
        "Article",
        ...result.map((item) => ({ type: "Category" as const, id: item?.id })),
      ],
    }),
    getCategory: builder.query<Category, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/categories/${id}/`, method: "get" }),
      providesTags: (result, error, { id }) => [{ type: "Category", id: id }],
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
    getFolder: builder.query<FolderDetail, { id: number }>({
      query: ({ id }) => ({ url: `/vfse/folders/${id}/`, method: "get" }),
      providesTags: (
        result = { documents: [], name: "", categories: [] },
        error,
        { id }
      ) => [
        { type: "Folder", id: id },
        ...result.documents.map((item) => ({
          type: "Article" as const,
          id: item?.id,
        })),
      ],
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
        body: folder,
      }),
      invalidatesTags: (result, error, { folder }) => [
        "Folder",
        { type: "Category", id: folder.categories[0] },
      ],
    }),
    deleteFolder: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/vfse/folders/${id}/`,
        method: "delete",
      }),
      invalidatesTags: ["Folder"],
    }),
    getWorkOrders: builder.query<WorkOrder[], void>({
      query: () => ({ url: "/vfse/workorders/", method: "get" }),
    }),
    getDashboardList: builder.query<unknown, void>({
      query: () => ({ url: `/vfse/dashboard/` }),
    }),
    postTopicComment: builder.mutation<
      VfseTopicsCommentsCreateApiResponse,
      VfseTopicsCommentsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/comments/`,
        method: "POST",
        body: queryArg.comment,
      }),
      invalidatesTags: (result, error, queryArg) => [
        { type: "Comment", id: `Comment-${queryArg?.id}` },
        "Topics",
      ],
    }),
    getTopicsCommentsList: builder.query<
      VfseTopicsCommentsListApiResponse,
      VfseTopicsCommentsListApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/topics/${queryArg.id}/comments/` }),
      providesTags: (result, error, queryArg) => [
        { type: "Comment", id: `Comment-${queryArg?.id}` },
      ],
    }),
  }),
});
