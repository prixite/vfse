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
  VfseCommentsRepliesListApiResponse,
  VfseCommentsRepliesListApiArg,
} from "@src/store/reducers/generated";
import { ChatBotResponse, getTopicListArg } from "@src/types/interfaces";

type TopicListResponse = {
  data: VfseTopicsListApiResponse;
  link: string;
};

type CommentRepliesResponse = {
  data: VfseCommentsRepliesListApiResponse;
  link: string;
};

type TopicCommentsResponse = {
  data: VfseTopicsCommentsListApiResponse;
  link: string;
};
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
  tagTypes: [
    "Favorite",
    "Article",
    "Category",
    "Folder",
    "Topics",
    "Comment",
    "Reply",
  ],
  endpoints: (builder) => ({
    getPopularTopics: builder.query<
      VfseTopicsPopularListApiResponse,
      VfseTopicsPopularListApiArg
    >({
      query: () => ({
        url: `/vfse/topics/popular/`,
        method: "get",
      }),
      providesTags: ["Favorite", "Topics"],
    }),

    updateTopics: builder.mutation<
      VfseTopicsListApiResponse,
      { title: string; description: string }
    >({
      query: ({ title, description }) => ({
        url: `/vfse/topics/`,
        method: "POST",
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
    getTopicsList: builder.query<TopicListResponse, getTopicListArg>({
      query: (queryArg) => ({
        url: `/vfse/topics/`,
        params: {
          followed: queryArg.followed,
          created: queryArg.created,
          page: queryArg.page,
        },
      }),
      transformResponse: (
        response: VfseTopicsListApiResponse,
        meta
      ): TopicListResponse => {
        return {
          data: response,
          link: meta.response.headers.get("link"),
        };
      },
      providesTags: ["Topics", "Favorite"],
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
        method: "POST",
        body: { query: query },
      }),
    }),
    getTopArticles: builder.query<Document[], void>({
      query: () => ({ url: "/vfse/documents/?favorite=true", method: "get" }),
      providesTags: ["Favorite", "Article"],
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
        method: "PATCH",
        body: document,
      }),
      invalidatesTags: ["Article", "Favorite"],
    }),
    addArticle: builder.mutation<Document, { document: Document }>({
      query: ({ document }) => ({
        url: "/vfse/documents/",
        method: "POST",
        body: document,
      }),
      invalidatesTags: [{ type: "Article" }, "Category", "Folder"],
    }),
    deleteArticle: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/vfse/documents/${id}/`,
        method: "DELETE",
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
        method: "POST",
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
        method: "PATCH",
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
        method: "PATCH",
        data: folder,
      }),
      invalidatesTags: ["Folder"],
    }),
    addFolder: builder.mutation<Folder, { folder: Folder }>({
      query: ({ folder }) => ({
        url: "/vfse/folders/",
        method: "POST",
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
        method: "DELETE",
      }),
      invalidatesTags: ["Folder", "Category"],
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
        "Reply",
      ],
    }),
    getTopicsCommentsList: builder.query<
      TopicCommentsResponse,
      VfseTopicsCommentsListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/comments/`,
        params: { page: queryArg.page },
      }),
      transformResponse: (
        response: VfseTopicsCommentsListApiResponse,
        meta
      ): TopicCommentsResponse => {
        return {
          data: response,
          link: meta.response.headers.get("link"),
        };
      },
      providesTags: (result, error, queryArg) => [
        { type: "Comment", id: `Comment-${queryArg?.id}` },
      ],
    }),
    getCommentsRepliesList: builder.query<
      CommentRepliesResponse,
      VfseCommentsRepliesListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/comments/${queryArg.id}/replies/`,
        params: { page: queryArg.page },
      }),
      transformResponse: (
        response: VfseCommentsRepliesListApiResponse,
        meta
      ): CommentRepliesResponse => {
        return {
          data: response,
          link: meta.response.headers.get("link"),
        };
      },
      providesTags: (result, error, queryArg) => [
        { type: "Reply", id: `Reply-${queryArg?.id}` },
      ],
    }),
  }),
});
