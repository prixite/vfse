// import { rtk } from "@src/store/reducers/generated";
import { rtk } from "./generatedWrapper";

const enhancedRtkApi = rtk.enhanceEndpoints({
  addTagTypes: [
    "Document",
    "User",
    "Organization",
    "HealthNetwork",
    "Site",
    "Note",
    "System",
    "SystemImage",
    "Product",
    "ProductModel",
    "Folder",
    "Topics",
    "Favorite",
    "Reply",
    "RecentActivity",
    "UserProfile",
    "Category",
    "Manufacturer",
  ],
  endpoints: {
    vfseUserActivityList: {
      providesTags: ["RecentActivity", "Reply", "Comment", "Topics"],
    },
    vfseTopicsCommentsCreate: {
      invalidatesTags: ["RecentActivity"],
    },
    vfseCommentsRepliesList: {
      providesTags: (result = [], error, { id }) => {
        return [
          ...result.map(({ id }) => ({
            type: "Reply" as const,
            id: `Reply-${id}`,
          })),
          { type: "Comment", id: `Comment-${id}` },
          { type: "Topics", id: `Topics-${id}` },
        ];
      },
    },
    vfseCommentsRepliesCreate: {
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Topics" as const, id: `Topics-${id}` },
          { type: "Reply" as const, id: `Reply-${id}` },
          "Comment",
          "Reply",
        ];
      },
    },
    vfseTopicsFollowPartialUpdate: {
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Topics" as const, id: `Topics-${id}` },
          "Topics",
          "Favorite",
        ];
      },
    },
    organizationsList: {
      providesTags: ["Organization"],
    },
    organizationsCreate: {
      invalidatesTags: ["Organization"],
    },
    organizationsDelete: {
      invalidatesTags: (_, error, { id }) => {
        return [
          { type: "HealthNetwork" as const, id: `HealthNetworks-${id}` },
          "Organization",
          "Site",
        ];
      },
    },
    organizationsPartialUpdate: {
      invalidatesTags: (result, errorr, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
        "Organization",
      ],
    },
    healthNetworksList: {
      providesTags: ["HealthNetwork"],
    },
    organizationsHealthNetworksList: {
      providesTags: (result = [], errors, { id }) => {
        // TODO: Verify this. Why are we poviding tags for Site?
        return [
          ...result.map(({ id }) => ({
            type: "HealthNetwork" as const,
            id: `HealthNetworks-${id}`,
          })),
          ...result.map(({ id }) => ({
            type: "Site" as const,
            id: `Sites-${id}`,
          })),
          { type: "HealthNetwork", id: `HealthNetworks-${id}` },
          "Site",
        ];
      },
    },
    organizationsHealthNetworksCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
        "HealthNetwork",
        "Site",
      ],
    },
    organizationsHealthNetworksUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
        "HealthNetwork",
      ],
    },
    organizationsSitesList: {
      providesTags: (result = [], error, { id }) => [
        ...result.map(({ id }) => ({
          type: "Site" as const,
          id: `Sites-${id}`,
        })),
        { type: "Site", id: `Sites-${id}` },
        "Site",
        "Organization",
        "System",
      ],
    },
    organizationsAssociatedSitesList: {
      providesTags: (result = [], error, { id }) => [
        ...result.map(({ id }) => ({
          type: "Site" as const,
          id: `Sites-${id}`,
        })),
        { type: "Site", id: `Sites-${id}` },
        "Site",
        "Organization",
      ],
    },
    organizationsRead: {
      providesTags: (result, error, { id }) => [
        { type: "Site", id: `Sites-${id}` },
      ],
    },
    organizationsSitesCreate: {
      invalidatesTags: (result, error, { id }) => {
        return [{ type: "Site", id: `Sites-${id}` }, "Site"];
      },
    },
    organizationsSitesUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Site", id: `Sites-${id}` },
        "Site",
      ],
    },
    organizationsSystemsList: {
      providesTags: (result, error, { id }) => {
        return [{ type: "System", id: `Systems-${id}` }, "Site"];
      },
    },
    organizationsSystemsCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "System", id: `Systems-${id}` },
        "System",
      ],
    },
    organizationsSystemsPartialUpdate: {
      invalidatesTags: (result, error, { id, systemPk }) => [
        { type: "System", id: `Systems-${id}` },
        { type: "System", id: `Systems-${id}-${systemPk}` },
      ],
    },
    organizationsSystemsDelete: {
      invalidatesTags: (result, error, { id, systemPk }) => {
        return [
          { type: "System", id: `Systems-${id}` },
          { type: "System", id: `Systems-${id}-${systemPk}` },
          "Site",
        ];
      },
    },
    organizationsUsersList: {
      providesTags: (result, error, { id }) => [
        { type: "User", id: `User-${id}` },
        "Organization",
      ],
    },
    organizationsUsersCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `User-${id}` },
      ],
    },
    scopeUsersList: {
      providesTags: (result = [], error, { id }) => [
        ...result.map(({ id }) => ({
          type: "User" as const,
          id: `User-${id}`,
        })),
        { type: "User", id: `User-${id}` },
        "Organization",
      ],
    },
    scopeUsersCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `User-${id}` },
      ],
    },
    productsList: {
      providesTags: ["Product"],
    },
    productsCreate: {
      invalidatesTags: ["Product"],
    },
    productsPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: `Product-${id}` },
        "Product",
      ],
    },
    productsDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: `Product-${id}` },
        "Product",
      ],
    },
    productsModelsList: {
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({
          type: "ProductModel" as const,
          id: `ProductModel-${id}`,
        })),
        "ProductModel",
      ],
    },
    productsModelsCreate: {
      invalidatesTags: ["ProductModel"],
    },
    productsModelsPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductModel", id: `ProductModel-${id}` },
      ],
    },
    productsModelsDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductModel", id: `ProductModel-${id}` },
      ],
    },
    systemsImagesList: {
      providesTags: ["SystemImage"],
    },
    systemsImagesCreate: {
      invalidatesTags: ["SystemImage"],
    },
    systemsNotesList: {
      providesTags: (result = [], error, { id }) => [
        ...result.map(({ id }) => ({
          type: "Note" as const,
          id: `Notes-${id}`,
        })),
        { type: "Note", id: `Notes-${id}` },
      ],
    },
    systemsNotesCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id: `Notes-${id}` },
      ],
    },
    notesDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id: `Notes-${id}` },
      ],
    },
    notesPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id: `Notes-${id}` },
      ],
    },
    usersActivatePartialUpdate: {
      invalidatesTags: (result, error, { userEnableDisable }) => [
        { type: "User", id: `User-${userEnableDisable.users[0]}` },
      ],
    },
    usersDeactivatePartialUpdate: {
      invalidatesTags: (result, error, { userEnableDisable }) => [
        { type: "User", id: `User-${userEnableDisable.users[0]}` },
      ],
    },
    usersPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `User-${id}` },
      ],
    },
    vfseDocumentsList: {
      providesTags: ["Document"],
    },
    vfseDocumentsCreate: {
      invalidatesTags: ["Document"],
    },
    vfseDocumentsPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id: `Document-${id}` },
        "Document",
      ],
    },
    vfseDocumentsDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id: `Document-${id}` },
        "Document",
      ],
    },
    vfseFoldersList: {
      providesTags: ["Folder"],
    },
    vfseFoldersCreate: {
      invalidatesTags: ["Folder"],
    },
    vfseFoldersPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Folder", id: `Folder-${id}` },
        "Folder",
      ],
    },
    vfseFoldersDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Folder", id: `Folder-${id}` },
        "Folder",
      ],
    },
    organizationsMeRead: {
      providesTags: ["UserProfile"],
    },
    usersMePartialUpdate: {
      invalidatesTags: ["UserProfile"],
    },
    vfseCategoriesList: {
      providesTags: ["Category"],
    },
    vfseCategoriesPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id: `Category-${id}` },
        "Category",
      ],
    },
    vfseCategoriesDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id: `Category-${id}` },
        "Category",
      ],
    },
    manufacturersCreate: {
      invalidatesTags: ["Manufacturer"],
    },
    modalitiesManufacturersList: {
      providesTags: ["Manufacturer"],
    },
  },
});

export * from "@src/store/reducers/generated";

// export const exportedFunctions = {
//   useOrganizationsMeReadQuery: generatedimports.useOrganizationsMeReadQuery,
//   useOrganizationsReadQuery: generatedimports.useOrganizationsReadQuery,
//  api: api,

// };

export { enhancedRtkApi as api };
