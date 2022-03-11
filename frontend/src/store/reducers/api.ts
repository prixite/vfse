import { rtk } from "@src/store/reducers/generated";

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
  ],
  endpoints: {
    organizationsList: {
      providesTags: ["Organization"],
    },
    organizationsCreate: {
      invalidatesTags: ["Organization"],
    },
    organizationsDelete: {
      invalidatesTags: ["Organization"],
    },
    organizationsPartialUpdate: {
      invalidatesTags: ["Organization"],
    },
    healthNetworksList: {
      providesTags: ["HealthNetwork"],
    },
    organizationsHealthNetworksList: {
      providesTags: (result, error, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
      ],
    },
    organizationsHealthNetworksCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
        "HealthNetwork",
      ],
    },
    organizationsHealthNetworksUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "HealthNetwork", id: `HealthNetworks-${id}` },
        "HealthNetwork",
      ],
    },
    organizationsSitesList: {
      providesTags: (result, error, { id }) => [
        { type: "Site", id: `Sites-${id}` },
      ],
    },
    organizationsSitesCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Site", id: `Sites-${id}` },
      ],
    },
    organizationsSitesUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "Site", id: `Sites-${id}` },
      ],
    },
    organizationsSystemsList: {
      providesTags: (result, error, { id }) => [
        { type: "System", id: `Systems-${id}` },
      ],
    },
    organizationsSystemsCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "System", id: `Systems-${id}` },
      ],
    },
    organizationsSystemsPartialUpdate: {
      invalidatesTags: (result, error, { id, systemPk }) => [
        { type: "System", id: `Systems-${id}` },
        { type: "System", id: `Systems-${id}-${systemPk}` },
      ],
    },
    organizationsSystemsDelete: {
      invalidatesTags: (result, error, { id, systemPk }) => [
        { type: "System", id: `Systems-${id}` },
        { type: "System", id: `Systems-${id}-${systemPk}` },
      ],
    },
    organizationsUsersList: {
      providesTags: (result, error, { id }) => [
        { type: "User", id: `Users-${id}` },
      ],
    },
    organizationsUsersCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `Users-${id}` },
      ],
    },
    scopeUsersList: {
      providesTags: (result, error, { id }) => [
        { type: "User", id: `Users-${id}` },
      ],
    },
    scopeUsersCreate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `Users-${id}` },
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
      providesTags: ["ProductModel"],
    },
    productsModelsCreate: {
      invalidatesTags: ["ProductModel"],
    },
    productsModelsPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductModel", id: `ProductModel-${id}` },
        "ProductModel",
      ],
    },
    productsModelsDelete: {
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductModel", id: `ProductModel-${id}` },
        "ProductModel",
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
      invalidatesTags: ["User"],
    },
    usersDeactivatePartialUpdate: {
      invalidatesTags: ["User"],
    },
    usersPartialUpdate: {
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `Users-${id}` },
        "User",
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
  },
});

export * from "@src/store/reducers/generated";
export { enhancedRtkApi as api };
