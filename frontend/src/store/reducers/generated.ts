import { emptySplitApi as api } from "@src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    accountsRequestsCreate: build.mutation<
      AccountsRequestsCreateApiResponse,
      AccountsRequestsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/accounts/requests/`,
        method: "POST",
        body: queryArg.userRequestAccess,
      }),
    }),
    healthNetworksList: build.query<
      HealthNetworksListApiResponse,
      HealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/health_networks/`,
        params: { name: queryArg.name, search: queryArg.search },
      }),
    }),
    manufacturersList: build.query<
      ManufacturersListApiResponse,
      ManufacturersListApiArg
    >({
      query: () => ({ url: `/manufacturers/` }),
    }),
    manufacturersCreate: build.mutation<
      ManufacturersCreateApiResponse,
      ManufacturersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/manufacturers/`,
        method: "POST",
        body: queryArg.manufacturer,
      }),
    }),
    manufacturersImagesList: build.query<
      ManufacturersImagesListApiResponse,
      ManufacturersImagesListApiArg
    >({
      query: () => ({ url: `/manufacturers/images/` }),
    }),
    manufacturersImagesCreate: build.mutation<
      ManufacturersImagesCreateApiResponse,
      ManufacturersImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/manufacturers/images/`,
        method: "POST",
        body: queryArg.manufacturerImage,
      }),
    }),
    modalitiesManufacturersList: build.query<
      ModalitiesManufacturersListApiResponse,
      ModalitiesManufacturersListApiArg
    >({
      query: (queryArg) => ({
        url: `/modalities/${queryArg.id}/manufacturers/`,
      }),
    }),
    notesPartialUpdate: build.mutation<
      NotesPartialUpdateApiResponse,
      NotesPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/notes/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.noteSerialier,
      }),
    }),
    notesDelete: build.mutation<NotesDeleteApiResponse, NotesDeleteApiArg>({
      query: (queryArg) => ({
        url: `/notes/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    organizationsList: build.query<
      OrganizationsListApiResponse,
      OrganizationsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/`,
        params: { name: queryArg.name, search: queryArg.search },
      }),
    }),
    organizationsCreate: build.mutation<
      OrganizationsCreateApiResponse,
      OrganizationsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/`,
        method: "POST",
        body: queryArg.organization,
      }),
    }),
    organizationsExistsRead: build.query<
      OrganizationsExistsReadApiResponse,
      OrganizationsExistsReadApiArg
    >({
      query: () => ({ url: `/organizations/exists/` }),
    }),
    organizationsRead: build.query<
      OrganizationsReadApiResponse,
      OrganizationsReadApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/` }),
    }),
    organizationsPartialUpdate: build.mutation<
      OrganizationsPartialUpdateApiResponse,
      OrganizationsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.organization,
      }),
    }),
    organizationsDelete: build.mutation<
      OrganizationsDeleteApiResponse,
      OrganizationsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    organizationsAssociatedSitesList: build.query<
      OrganizationsAssociatedSitesListApiResponse,
      OrganizationsAssociatedSitesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/associated_sites/`,
      }),
    }),
    organizationsHealthNetworksList: build.query<
      OrganizationsHealthNetworksListApiResponse,
      OrganizationsHealthNetworksListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
      }),
    }),
    organizationsHealthNetworksCreate: build.mutation<
      OrganizationsHealthNetworksCreateApiResponse,
      OrganizationsHealthNetworksCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
        method: "POST",
        body: queryArg.healthNetwork,
      }),
    }),
    organizationsHealthNetworksUpdate: build.mutation<
      OrganizationsHealthNetworksUpdateApiResponse,
      OrganizationsHealthNetworksUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/health_networks/`,
        method: "PUT",
        body: queryArg.organizationHealthNetwork,
      }),
    }),
    organizationsMeRead: build.query<
      OrganizationsMeReadApiResponse,
      OrganizationsMeReadApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/me/` }),
    }),
    organizationsModalitiesList: build.query<
      OrganizationsModalitiesListApiResponse,
      OrganizationsModalitiesListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/modalities/`,
      }),
    }),
    organizationsSeatsList: build.query<
      OrganizationsSeatsListApiResponse,
      OrganizationsSeatsListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/seats/` }),
    }),
    organizationsSeatsCreate: build.mutation<
      OrganizationsSeatsCreateApiResponse,
      OrganizationsSeatsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/seats/`,
        method: "POST",
        body: queryArg.organizationSeatSeriazlier,
      }),
    }),
    organizationsSitesList: build.query<
      OrganizationsSitesListApiResponse,
      OrganizationsSitesListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/sites/` }),
    }),
    organizationsSitesCreate: build.mutation<
      OrganizationsSitesCreateApiResponse,
      OrganizationsSitesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/sites/`,
        method: "POST",
        body: queryArg.metaSite,
      }),
    }),
    organizationsSitesUpdate: build.mutation<
      OrganizationsSitesUpdateApiResponse,
      OrganizationsSitesUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/sites/`,
        method: "PUT",
        body: queryArg.organizationSite,
      }),
    }),
    organizationsSystemsList: build.query<
      OrganizationsSystemsListApiResponse,
      OrganizationsSystemsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/`,
        params: {
          site: queryArg.site,
          health_network: queryArg.healthNetwork,
          modality: queryArg.modality,
        },
      }),
    }),
    organizationsSystemsCreate: build.mutation<
      OrganizationsSystemsCreateApiResponse,
      OrganizationsSystemsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/`,
        method: "POST",
        body: queryArg.system,
      }),
    }),
    organizationsSystemsUpdate: build.mutation<
      OrganizationsSystemsUpdateApiResponse,
      OrganizationsSystemsUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/`,
        method: "PUT",
        body: queryArg.influxSystems,
      }),
    }),
    organizationsSystemsPartialUpdate: build.mutation<
      OrganizationsSystemsPartialUpdateApiResponse,
      OrganizationsSystemsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/`,
        method: "PATCH",
        body: queryArg.system,
      }),
    }),
    organizationsSystemsDelete: build.mutation<
      OrganizationsSystemsDeleteApiResponse,
      OrganizationsSystemsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/`,
        method: "DELETE",
      }),
    }),
    organizationsSystemsUpdateFromInflux: build.mutation<
      OrganizationsSystemsUpdateFromInfluxApiResponse,
      OrganizationsSystemsUpdateFromInfluxApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/systems/${queryArg.systemPk}/influxdb/`,
        method: "PATCH",
        body: queryArg.system,
      }),
    }),
    organizationsUsersList: build.query<
      OrganizationsUsersListApiResponse,
      OrganizationsUsersListApiArg
    >({
      query: (queryArg) => ({ url: `/organizations/${queryArg.id}/users/` }),
    }),
    organizationsUsersCreate: build.mutation<
      OrganizationsUsersCreateApiResponse,
      OrganizationsUsersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.id}/users/`,
        method: "POST",
        body: queryArg.organizationUpsertUser,
      }),
    }),
    organizationsSystemsLocationsList: build.query<
      OrganizationsSystemsLocationsListApiResponse,
      OrganizationsSystemsLocationsListApiArg
    >({
      query: (queryArg) => ({
        url: `/organizations/${queryArg.orgId}/systems/${queryArg.systemId}/locations/`,
        params: { system: queryArg.system },
      }),
    }),
    productsList: build.query<ProductsListApiResponse, ProductsListApiArg>({
      query: (queryArg) => ({
        url: `/products/`,
        params: { manufacturer: queryArg.manufacturer },
      }),
    }),
    productsCreate: build.mutation<
      ProductsCreateApiResponse,
      ProductsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/`,
        method: "POST",
        body: queryArg.productCreate,
      }),
    }),
    productsModelsList: build.query<
      ProductsModelsListApiResponse,
      ProductsModelsListApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/`,
        params: { modality: queryArg.modality, product: queryArg.product },
      }),
    }),
    productsModelsCreate: build.mutation<
      ProductsModelsCreateApiResponse,
      ProductsModelsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/`,
        method: "POST",
        body: queryArg.productModelCreate,
      }),
    }),
    productsModelsPartialUpdate: build.mutation<
      ProductsModelsPartialUpdateApiResponse,
      ProductsModelsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.productModelCreate,
      }),
    }),
    productsModelsDelete: build.mutation<
      ProductsModelsDeleteApiResponse,
      ProductsModelsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/products/models/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    productsPartialUpdate: build.mutation<
      ProductsPartialUpdateApiResponse,
      ProductsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/products/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.product,
      }),
    }),
    productsDelete: build.mutation<
      ProductsDeleteApiResponse,
      ProductsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/products/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    scopeUsersList: build.query<
      ScopeUsersListApiResponse,
      ScopeUsersListApiArg
    >({
      query: (queryArg) => ({ url: `/scope/${queryArg.id}/users/` }),
    }),
    scopeUsersCreate: build.mutation<
      ScopeUsersCreateApiResponse,
      ScopeUsersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/scope/${queryArg.id}/users/`,
        method: "POST",
        body: queryArg.organizationUpsertUser,
      }),
    }),
    systemsImagesList: build.query<
      SystemsImagesListApiResponse,
      SystemsImagesListApiArg
    >({
      query: () => ({ url: `/systems/images/` }),
    }),
    systemsImagesCreate: build.mutation<
      SystemsImagesCreateApiResponse,
      SystemsImagesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/images/`,
        method: "POST",
        body: queryArg.systemImage,
      }),
    }),
    systemsInfluxdbList: build.query<
      SystemsInfluxdbListApiResponse,
      SystemsInfluxdbListApiArg
    >({
      query: () => ({ url: `/systems/influxdb/` }),
    }),
    systemsNotesList: build.query<
      SystemsNotesListApiResponse,
      SystemsNotesListApiArg
    >({
      query: (queryArg) => ({ url: `/systems/${queryArg.id}/notes/` }),
    }),
    systemsNotesCreate: build.mutation<
      SystemsNotesCreateApiResponse,
      SystemsNotesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/${queryArg.id}/notes/`,
        method: "POST",
        body: queryArg.systemNotes,
      }),
    }),
    systemsSshPasswordRead: build.query<
      SystemsSshPasswordReadApiResponse,
      SystemsSshPasswordReadApiArg
    >({
      query: (queryArg) => ({ url: `/systems/${queryArg.id}/ssh_password/` }),
    }),
    systemsChatbotList: build.query<
      SystemsChatbotListApiResponse,
      SystemsChatbotListApiArg
    >({
      query: (queryArg) => ({ url: `/systems/${queryArg.systemId}/chatbot/` }),
    }),
    systemsChatbotCreate: build.mutation<
      SystemsChatbotCreateApiResponse,
      SystemsChatbotCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/systems/${queryArg.systemId}/chatbot/`,
        method: "POST",
      }),
    }),
    usersActivatePartialUpdate: build.mutation<
      UsersActivatePartialUpdateApiResponse,
      UsersActivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/activate/`,
        method: "PATCH",
        body: queryArg.userEnableDisable,
      }),
    }),
    usersActiveUsersList: build.query<
      UsersActiveUsersListApiResponse,
      UsersActiveUsersListApiArg
    >({
      query: (queryArg) => ({
        url: `/users/active_users/`,
        params: { page: queryArg.page },
      }),
    }),
    usersChangePasswordPartialUpdate: build.mutation<
      UsersChangePasswordPartialUpdateApiResponse,
      UsersChangePasswordPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/change_password/`,
        method: "PATCH",
        body: queryArg.upsertUserPassword,
      }),
    }),
    usersDeactivatePartialUpdate: build.mutation<
      UsersDeactivatePartialUpdateApiResponse,
      UsersDeactivatePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/deactivate/`,
        method: "PATCH",
        body: queryArg.userEnableDisable,
      }),
    }),
    usersMePartialUpdate: build.mutation<
      UsersMePartialUpdateApiResponse,
      UsersMePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/me/`,
        method: "PATCH",
        body: queryArg.meUpdate,
      }),
    }),
    usersRolesList: build.query<
      UsersRolesListApiResponse,
      UsersRolesListApiArg
    >({
      query: () => ({ url: `/users/roles/` }),
    }),
    usersPartialUpdate: build.mutation<
      UsersPartialUpdateApiResponse,
      UsersPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/users/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.upsertUser,
      }),
    }),
    vfseCategoriesList: build.query<
      VfseCategoriesListApiResponse,
      VfseCategoriesListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/categories/`,
        params: { name: queryArg.name },
      }),
    }),
    vfseCategoriesCreate: build.mutation<
      VfseCategoriesCreateApiResponse,
      VfseCategoriesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/categories/`,
        method: "POST",
        body: queryArg.category,
      }),
    }),
    vfseCategoriesRead: build.query<
      VfseCategoriesReadApiResponse,
      VfseCategoriesReadApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/categories/${queryArg.id}/` }),
    }),
    vfseCategoriesPartialUpdate: build.mutation<
      VfseCategoriesPartialUpdateApiResponse,
      VfseCategoriesPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/categories/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.category,
      }),
    }),
    vfseCategoriesDelete: build.mutation<
      VfseCategoriesDeleteApiResponse,
      VfseCategoriesDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/categories/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    vfseCommentsRepliesList: build.query<
      VfseCommentsRepliesListApiResponse,
      VfseCommentsRepliesListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/comments/${queryArg.id}/replies/`,
        params: { page: queryArg.page },
      }),
    }),
    vfseCommentsRepliesCreate: build.mutation<
      VfseCommentsRepliesCreateApiResponse,
      VfseCommentsRepliesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/comments/${queryArg.id}/replies/`,
        method: "POST",
        body: queryArg.comment,
      }),
    }),
    vfseDashboardList: build.query<
      VfseDashboardListApiResponse,
      VfseDashboardListApiArg
    >({
      query: () => ({ url: `/vfse/dashboard/` }),
    }),
    vfseDocumentsList: build.query<
      VfseDocumentsListApiResponse,
      VfseDocumentsListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/`,
        params: { folder: queryArg.folder, favorite: queryArg.favorite },
      }),
    }),
    vfseDocumentsCreate: build.mutation<
      VfseDocumentsCreateApiResponse,
      VfseDocumentsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/`,
        method: "POST",
        body: queryArg.document,
      }),
    }),
    vfseDocumentsRead: build.query<
      VfseDocumentsReadApiResponse,
      VfseDocumentsReadApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/documents/${queryArg.id}/` }),
    }),
    vfseDocumentsPartialUpdate: build.mutation<
      VfseDocumentsPartialUpdateApiResponse,
      VfseDocumentsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.document,
      }),
    }),
    vfseDocumentsDelete: build.mutation<
      VfseDocumentsDeleteApiResponse,
      VfseDocumentsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/documents/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    vfseFoldersList: build.query<
      VfseFoldersListApiResponse,
      VfseFoldersListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/`,
        params: { categories: queryArg.categories },
      }),
    }),
    vfseFoldersCreate: build.mutation<
      VfseFoldersCreateApiResponse,
      VfseFoldersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/`,
        method: "POST",
        body: queryArg.folder,
      }),
    }),
    vfseFoldersRead: build.query<
      VfseFoldersReadApiResponse,
      VfseFoldersReadApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/folders/${queryArg.id}/` }),
    }),
    vfseFoldersPartialUpdate: build.mutation<
      VfseFoldersPartialUpdateApiResponse,
      VfseFoldersPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.folder,
      }),
    }),
    vfseFoldersDelete: build.mutation<
      VfseFoldersDeleteApiResponse,
      VfseFoldersDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/folders/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    vfseTopicsList: build.query<
      VfseTopicsListApiResponse,
      VfseTopicsListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/`,
        params: {
          followed: queryArg.followed,
          created: queryArg.created,
          query: queryArg.query,
          page: queryArg.page,
        },
      }),
    }),
    vfseTopicsCreate: build.mutation<
      VfseTopicsCreateApiResponse,
      VfseTopicsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/`,
        method: "POST",
        body: queryArg.topic,
      }),
    }),
    vfseTopicsPopularList: build.query<
      VfseTopicsPopularListApiResponse,
      VfseTopicsPopularListApiArg
    >({
      query: () => ({ url: `/vfse/topics/popular/` }),
    }),
    vfseTopicsRead: build.query<
      VfseTopicsReadApiResponse,
      VfseTopicsReadApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/topics/${queryArg.id}/` }),
    }),
    vfseTopicsPartialUpdate: build.mutation<
      VfseTopicsPartialUpdateApiResponse,
      VfseTopicsPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.topic,
      }),
    }),
    vfseTopicsDelete: build.mutation<
      VfseTopicsDeleteApiResponse,
      VfseTopicsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    vfseTopicsCommentsList: build.query<
      VfseTopicsCommentsListApiResponse,
      VfseTopicsCommentsListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/comments/`,
        params: { page: queryArg.page },
      }),
    }),
    vfseTopicsCommentsCreate: build.mutation<
      VfseTopicsCommentsCreateApiResponse,
      VfseTopicsCommentsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/comments/`,
        method: "POST",
        body: queryArg.comment,
      }),
    }),
    vfseTopicsFollowPartialUpdate: build.mutation<
      VfseTopicsFollowPartialUpdateApiResponse,
      VfseTopicsFollowPartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/topics/${queryArg.id}/follow/`,
        method: "PATCH",
        body: queryArg.followUnfollow,
      }),
    }),
    vfseUserActivityList: build.query<
      VfseUserActivityListApiResponse,
      VfseUserActivityListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/user/activity/`,
        params: { topic: queryArg.topic },
      }),
    }),
    vfseUserMeActivityList: build.query<
      VfseUserMeActivityListApiResponse,
      VfseUserMeActivityListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/user/me/activity/`,
        params: { page: queryArg.page },
      }),
    }),
    vfseUserTopicList: build.query<
      VfseUserTopicListApiResponse,
      VfseUserTopicListApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/user/topic/`,
        params: { page: queryArg.page },
      }),
    }),
    vfseWorkordersList: build.query<
      VfseWorkordersListApiResponse,
      VfseWorkordersListApiArg
    >({
      query: () => ({ url: `/vfse/workorders/` }),
    }),
    vfseWorkordersCreate: build.mutation<
      VfseWorkordersCreateApiResponse,
      VfseWorkordersCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vfse/workorders/`,
        method: "POST",
        body: queryArg.workOrder,
      }),
    }),
    vfseWorkordersRead: build.query<
      VfseWorkordersReadApiResponse,
      VfseWorkordersReadApiArg
    >({
      query: (queryArg) => ({ url: `/vfse/workorders/${queryArg.id}/` }),
    }),
    websshlogList: build.query<WebsshlogListApiResponse, WebsshlogListApiArg>({
      query: () => ({ url: `/websshlog/` }),
    }),
    websshlogCreate: build.mutation<
      WebsshlogCreateApiResponse,
      WebsshlogCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/websshlog/`,
        method: "POST",
        body: queryArg.webSshLog,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as rtk };
export type AccountsRequestsCreateApiResponse =
  /** status 201  */ UserRequestAccess;
export type AccountsRequestsCreateApiArg = {
  userRequestAccess: UserRequestAccess;
};
export type HealthNetworksListApiResponse =
  /** status 200  */ HealthNetworkList[];
export type HealthNetworksListApiArg = {
  name?: string;
  search?: string;
};
export type ManufacturersListApiResponse = /** status 200  */ Manufacturer[];
export type ManufacturersListApiArg = void;
export type ManufacturersCreateApiResponse = /** status 201  */ Manufacturer;
export type ManufacturersCreateApiArg = {
  manufacturer: Manufacturer;
};
export type ManufacturersImagesListApiResponse =
  /** status 200  */ ManufacturerImage[];
export type ManufacturersImagesListApiArg = void;
export type ManufacturersImagesCreateApiResponse =
  /** status 201  */ ManufacturerImage;
export type ManufacturersImagesCreateApiArg = {
  manufacturerImage: ManufacturerImage;
};
export type ModalitiesManufacturersListApiResponse =
  /** status 200  */ Manufacturer[];
export type ModalitiesManufacturersListApiArg = {
  id: string;
};
export type NotesPartialUpdateApiResponse = /** status 200  */ NoteSerialier;
export type NotesPartialUpdateApiArg = {
  id: string;
  noteSerialier: NoteSerialier;
};
export type NotesDeleteApiResponse = unknown;
export type NotesDeleteApiArg = {
  id: string;
};
export type OrganizationsListApiResponse = /** status 200  */ Organization[];
export type OrganizationsListApiArg = {
  name?: string;
  search?: string;
};
export type OrganizationsCreateApiResponse = /** status 201  */ Organization;
export type OrganizationsCreateApiArg = {
  organization: Organization;
};
export type OrganizationsExistsReadApiResponse =
  /** status 200  */ Organization;
export type OrganizationsExistsReadApiArg = void;
export type OrganizationsReadApiResponse = /** status 200  */ Organization;
export type OrganizationsReadApiArg = {
  id: string;
};
export type OrganizationsPartialUpdateApiResponse =
  /** status 200  */ Organization;
export type OrganizationsPartialUpdateApiArg = {
  id: string;
  organization: Organization;
};
export type OrganizationsDeleteApiResponse = unknown;
export type OrganizationsDeleteApiArg = {
  id: string;
};
export type OrganizationsAssociatedSitesListApiResponse =
  /** status 200  */ Site[];
export type OrganizationsAssociatedSitesListApiArg = {
  id: string;
};
export type OrganizationsHealthNetworksListApiResponse =
  /** status 200  */ HealthNetwork[];
export type OrganizationsHealthNetworksListApiArg = {
  id: string;
};
export type OrganizationsHealthNetworksCreateApiResponse =
  /** status 201  */ HealthNetwork;
export type OrganizationsHealthNetworksCreateApiArg = {
  id: string;
  healthNetwork: HealthNetwork;
};
export type OrganizationsHealthNetworksUpdateApiResponse =
  /** status 200  */ OrganizationHealthNetwork;
export type OrganizationsHealthNetworksUpdateApiArg = {
  id: string;
  organizationHealthNetwork: OrganizationHealthNetwork;
};
export type OrganizationsMeReadApiResponse = /** status 200  */ Me;
export type OrganizationsMeReadApiArg = {
  id: string;
};
export type OrganizationsModalitiesListApiResponse =
  /** status 200  */ Modality[];
export type OrganizationsModalitiesListApiArg = {
  id: string;
};
export type OrganizationsSeatsListApiResponse = /** status 200  */ SeatList[];
export type OrganizationsSeatsListApiArg = {
  id: string;
};
export type OrganizationsSeatsCreateApiResponse =
  /** status 201  */ OrganizationSeatSeriazlier;
export type OrganizationsSeatsCreateApiArg = {
  id: string;
  organizationSeatSeriazlier: OrganizationSeatSeriazlier;
};
export type OrganizationsSitesListApiResponse = /** status 200  */ Site[];
export type OrganizationsSitesListApiArg = {
  id: string;
};
export type OrganizationsSitesCreateApiResponse = /** status 201  */ MetaSite;
export type OrganizationsSitesCreateApiArg = {
  id: string;
  metaSite: MetaSite;
};
export type OrganizationsSitesUpdateApiResponse =
  /** status 200  */ OrganizationSite;
export type OrganizationsSitesUpdateApiArg = {
  id: string;
  organizationSite: OrganizationSite;
};
export type OrganizationsSystemsListApiResponse = /** status 200  */ System[];
export type OrganizationsSystemsListApiArg = {
  id: string;
  site?: string;
  healthNetwork?: number;
  modality?: number;
};
export type OrganizationsSystemsCreateApiResponse = /** status 201  */ System;
export type OrganizationsSystemsCreateApiArg = {
  id: string;
  system: System;
};
export type OrganizationsSystemsUpdateApiResponse =
  /** status 200  */ InfluxSystems;
export type OrganizationsSystemsUpdateApiArg = {
  id: string;
  influxSystems: InfluxSystems;
};
export type OrganizationsSystemsPartialUpdateApiResponse =
  /** status 200  */ System;
export type OrganizationsSystemsPartialUpdateApiArg = {
  id: string;
  systemPk: string;
  system: System;
};
export type OrganizationsSystemsDeleteApiResponse = unknown;
export type OrganizationsSystemsDeleteApiArg = {
  id: string;
  systemPk: string;
};
export type OrganizationsSystemsUpdateFromInfluxApiResponse =
  /** status 200  */ System;
export type OrganizationsSystemsUpdateFromInfluxApiArg = {
  id: string;
  systemPk: string;
  system: System;
};
export type OrganizationsUsersListApiResponse = /** status 200  */ User[];
export type OrganizationsUsersListApiArg = {
  id: string;
};
export type OrganizationsUsersCreateApiResponse =
  /** status 201  */ OrganizationUpsertUser;
export type OrganizationsUsersCreateApiArg = {
  id: string;
  organizationUpsertUser: OrganizationUpsertUser;
};
export type OrganizationsSystemsLocationsListApiResponse =
  /** status 200  */ RouterLocation[];
export type OrganizationsSystemsLocationsListApiArg = {
  orgId: string;
  systemId: string;
  system?: number;
};
export type ProductsListApiResponse = /** status 200  */ Product[];
export type ProductsListApiArg = {
  manufacturer?: number;
};
export type ProductsCreateApiResponse = /** status 201  */ ProductCreate;
export type ProductsCreateApiArg = {
  productCreate: ProductCreate;
};
export type ProductsModelsListApiResponse = /** status 200  */ ProductModel[];
export type ProductsModelsListApiArg = {
  modality?: number;
  product?: number;
};
export type ProductsModelsCreateApiResponse =
  /** status 201  */ ProductModelCreate;
export type ProductsModelsCreateApiArg = {
  productModelCreate: ProductModelCreate;
};
export type ProductsModelsPartialUpdateApiResponse =
  /** status 200  */ ProductModelCreate;
export type ProductsModelsPartialUpdateApiArg = {
  id: string;
  productModelCreate: ProductModelCreate;
};
export type ProductsModelsDeleteApiResponse = unknown;
export type ProductsModelsDeleteApiArg = {
  id: string;
};
export type ProductsPartialUpdateApiResponse = /** status 200  */ Product;
export type ProductsPartialUpdateApiArg = {
  id: string;
  product: Product;
};
export type ProductsDeleteApiResponse = unknown;
export type ProductsDeleteApiArg = {
  id: string;
};
export type ScopeUsersListApiResponse = /** status 200  */ User[];
export type ScopeUsersListApiArg = {
  id: string;
};
export type ScopeUsersCreateApiResponse =
  /** status 201  */ OrganizationUpsertUser;
export type ScopeUsersCreateApiArg = {
  id: string;
  organizationUpsertUser: OrganizationUpsertUser;
};
export type SystemsImagesListApiResponse = /** status 200  */ SystemImage[];
export type SystemsImagesListApiArg = void;
export type SystemsImagesCreateApiResponse = /** status 201  */ SystemImage;
export type SystemsImagesCreateApiArg = {
  systemImage: SystemImage;
};
export type SystemsInfluxdbListApiResponse = unknown;
export type SystemsInfluxdbListApiArg = void;
export type SystemsNotesListApiResponse = /** status 200  */ SystemNotes[];
export type SystemsNotesListApiArg = {
  id: string;
};
export type SystemsNotesCreateApiResponse = /** status 201  */ SystemNotes;
export type SystemsNotesCreateApiArg = {
  id: string;
  systemNotes: SystemNotes;
};
export type SystemsSshPasswordReadApiResponse = /** status 200  */ SystemAccess;
export type SystemsSshPasswordReadApiArg = {
  id: string;
};
export type SystemsChatbotListApiResponse = unknown;
export type SystemsChatbotListApiArg = {
  systemId: string;
};
export type SystemsChatbotCreateApiResponse = unknown;
export type SystemsChatbotCreateApiArg = {
  systemId: string;
};
export type UsersActivatePartialUpdateApiResponse =
  /** status 200  */ UserEnableDisable;
export type UsersActivatePartialUpdateApiArg = {
  userEnableDisable: UserEnableDisable;
};
export type UsersActiveUsersListApiResponse = /** status 200  */ User[];
export type UsersActiveUsersListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type UsersChangePasswordPartialUpdateApiResponse =
  /** status 200  */ UpsertUserPassword;
export type UsersChangePasswordPartialUpdateApiArg = {
  upsertUserPassword: UpsertUserPassword;
};
export type UsersDeactivatePartialUpdateApiResponse =
  /** status 200  */ UserEnableDisable;
export type UsersDeactivatePartialUpdateApiArg = {
  userEnableDisable: UserEnableDisable;
};
export type UsersMePartialUpdateApiResponse = /** status 200  */ MeUpdate;
export type UsersMePartialUpdateApiArg = {
  meUpdate: MeUpdate;
};
export type UsersRolesListApiResponse = /** status 200  */ Role[];
export type UsersRolesListApiArg = void;
export type UsersPartialUpdateApiResponse = /** status 200  */ UpsertUser;
export type UsersPartialUpdateApiArg = {
  id: string;
  upsertUser: UpsertUser;
};
export type VfseCategoriesListApiResponse = /** status 200  */ Category[];
export type VfseCategoriesListApiArg = {
  name?: string;
};
export type VfseCategoriesCreateApiResponse = /** status 201  */ Category;
export type VfseCategoriesCreateApiArg = {
  category: Category;
};
export type VfseCategoriesReadApiResponse = /** status 200  */ Category;
export type VfseCategoriesReadApiArg = {
  id: string;
};
export type VfseCategoriesPartialUpdateApiResponse =
  /** status 200  */ Category;
export type VfseCategoriesPartialUpdateApiArg = {
  id: string;
  category: Category;
};
export type VfseCategoriesDeleteApiResponse = unknown;
export type VfseCategoriesDeleteApiArg = {
  id: string;
};
export type VfseCommentsRepliesListApiResponse = /** status 200  */ Comment[];
export type VfseCommentsRepliesListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type VfseCommentsRepliesCreateApiResponse = /** status 201  */ Comment;
export type VfseCommentsRepliesCreateApiArg = {
  id: string;
  comment: Comment;
};
export type VfseDashboardListApiResponse = unknown;
export type VfseDashboardListApiArg = void;
export type VfseDocumentsListApiResponse = /** status 200  */ Document[];
export type VfseDocumentsListApiArg = {
  folder?: string;
  favorite?: string;
};
export type VfseDocumentsCreateApiResponse = /** status 201  */ Document;
export type VfseDocumentsCreateApiArg = {
  document: Document;
};
export type VfseDocumentsReadApiResponse = /** status 200  */ Document;
export type VfseDocumentsReadApiArg = {
  id: string;
};
export type VfseDocumentsPartialUpdateApiResponse = /** status 200  */ Document;
export type VfseDocumentsPartialUpdateApiArg = {
  id: string;
  document: Document;
};
export type VfseDocumentsDeleteApiResponse = unknown;
export type VfseDocumentsDeleteApiArg = {
  id: string;
};
export type VfseFoldersListApiResponse = /** status 200  */ Folder[];
export type VfseFoldersListApiArg = {
  categories?: string;
};
export type VfseFoldersCreateApiResponse = /** status 201  */ Folder;
export type VfseFoldersCreateApiArg = {
  folder: Folder;
};
export type VfseFoldersReadApiResponse = /** status 200  */ FolderDetail;
export type VfseFoldersReadApiArg = {
  id: string;
};
export type VfseFoldersPartialUpdateApiResponse = /** status 200  */ Folder;
export type VfseFoldersPartialUpdateApiArg = {
  id: string;
  folder: Folder;
};
export type VfseFoldersDeleteApiResponse = unknown;
export type VfseFoldersDeleteApiArg = {
  id: string;
};
export type VfseTopicsListApiResponse = /** status 200  */ TopicDetail[];
export type VfseTopicsListApiArg = {
  followed?: string;
  created?: string;
  query?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type VfseTopicsCreateApiResponse = /** status 201  */ Topic;
export type VfseTopicsCreateApiArg = {
  topic: Topic;
};
export type VfseTopicsPopularListApiResponse = /** status 200  */ TopicDetail[];
export type VfseTopicsPopularListApiArg = void;
export type VfseTopicsReadApiResponse = /** status 200  */ TopicDetail;
export type VfseTopicsReadApiArg = {
  id: string;
};
export type VfseTopicsPartialUpdateApiResponse = /** status 200  */ Topic;
export type VfseTopicsPartialUpdateApiArg = {
  id: string;
  topic: Topic;
};
export type VfseTopicsDeleteApiResponse = unknown;
export type VfseTopicsDeleteApiArg = {
  id: string;
};
export type VfseTopicsCommentsListApiResponse = /** status 200  */ Comment[];
export type VfseTopicsCommentsListApiArg = {
  id: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type VfseTopicsCommentsCreateApiResponse = /** status 201  */ Comment;
export type VfseTopicsCommentsCreateApiArg = {
  id: string;
  comment: Comment;
};
export type VfseTopicsFollowPartialUpdateApiResponse =
  /** status 200  */ FollowUnfollow;
export type VfseTopicsFollowPartialUpdateApiArg = {
  id: string;
  followUnfollow: FollowUnfollow;
};
export type VfseUserActivityListApiResponse =
  /** status 200  */ RecentActivity[];
export type VfseUserActivityListApiArg = {
  topic?: number;
};
export type VfseUserMeActivityListApiResponse =
  /** status 200  */ RecentActivity[];
export type VfseUserMeActivityListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type VfseUserTopicListApiResponse = /** status 200  */ TopicDetail[];
export type VfseUserTopicListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
};
export type VfseWorkordersListApiResponse =
  /** status 200  */ WorkOrderDetail[];
export type VfseWorkordersListApiArg = void;
export type VfseWorkordersCreateApiResponse = /** status 201  */ WorkOrder;
export type VfseWorkordersCreateApiArg = {
  workOrder: WorkOrder;
};
export type VfseWorkordersReadApiResponse = /** status 200  */ WorkOrderDetail;
export type VfseWorkordersReadApiArg = {
  id: string;
};
export type WebsshlogListApiResponse = /** status 200  */ WebSshLog[];
export type WebsshlogListApiArg = void;
export type WebsshlogCreateApiResponse = /** status 201  */ WebSshLog;
export type WebsshlogCreateApiArg = {
  webSshLog: WebSshLog;
};
export type MetaSerialzer = {
  profile_picture?: string;
  title?: string;
  location?: string;
  slack_link?: string;
  calender_link?: string;
  zoom_link?: string;
};
export type UserRequestAccess = {
  meta?: MetaSerialzer;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role:
    | "fse-admin"
    | "customer-admin"
    | "user-admin"
    | "fse"
    | "end-user"
    | "cryo"
    | "cryo-fse"
    | "cryo-admin";
  manager?: number;
  organization: number;
  sites?: number[];
  modalities?: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
  documentation_url: boolean;
  health_networks: number[];
};
export type HealthNetworkList = {
  id?: number;
  name: string;
};
export type Manufacturer = {
  id?: number;
  name: string;
  image?: number | null;
};
export type ManufacturerImage = {
  image?: string | null;
};
export type NoteSerialier = {
  id?: number;
  note: string;
};
export type OrganizationAppearance = {
  sidebar_text?: string;
  button_text?: string;
  sidebar_color?: string;
  primary_color?: string;
  secondary_color?: string;
  font_one?: string;
  font_two?: string;
  logo?: string;
  banner?: string;
  icon?: string;
};
export type MetaSite = {
  id?: number;
  name: string;
  address: string;
};
export type Organization = {
  id?: number;
  name: string;
  number_of_seats?: number | null;
  appearance?: OrganizationAppearance;
  sites?: MetaSite[];
};
export type Site = {
  id?: number;
  name: string;
  address: string;
  modalities?: string[];
  connections?: number;
};
export type HealthNetworkAppearance = {
  logo: string;
};
export type HealthNetwork = {
  id?: number;
  name: string;
  appearance?: HealthNetworkAppearance;
  sites?: MetaSite[];
};
export type HealthNetworkCreate = {
  id?: number | null;
  name: string;
  appearance?: HealthNetworkAppearance;
  sites?: MetaSite[];
};
export type OrganizationHealthNetwork = {
  id?: number;
  health_networks: HealthNetworkCreate[];
};
export type Me = {
  id?: number;
  first_name?: string;
  last_name?: string;
  flags?: string;
  organization?: Organization;
  role?: string;
  profile_picture: string;
  is_superuser?: boolean;
  can_leave_notes: boolean;
  fse_accessible: boolean;
  documentation_url: boolean;
  view_only: boolean;
  location: string;
  slack_link: string;
  calender_link: string;
  email?: string;
  zoom_link: string;
  audit_enabled: boolean;
};
export type Modality = {
  id?: number;
  name: string;
  group?:
    | (
        | "mri"
        | "pet"
        | "rf"
        | "bmd"
        | "cr"
        | "dx"
        | "ivus"
        | "mg"
        | "us"
        | "mi"
        | "mr"
        | "ct"
      )
    | null;
  show_ris?: boolean;
  show_dicom?: boolean;
};
export type Product = {
  id?: number;
  name: string;
  manufacturer: Manufacturer;
};
export type Documentation = {
  id?: number;
  url: string;
};
export type ProductModel = {
  id?: number;
  product: Product;
  model: string;
  modality: Modality;
  documentation: Documentation;
};
export type SystemInfo = {
  ip?: string;
  title?: string;
  port?: number | null;
  ae_title?: string;
};
export type MriInfo = {
  helium?: string;
  magnet_pressure?: string;
};
export type SystemConnectionOptions = {
  vfse: boolean;
  virtual_media_control: boolean;
  service_web_browser: boolean;
  ssh: boolean;
};
export type System = {
  id?: number;
  name: string;
  site: number;
  serial_number?: string | null;
  location_in_building?: string | null;
  system_contact_info?: string | null;
  grafana_link?: string | null;
  product_model: number;
  product_model_detail?: ProductModel;
  image?: number | null;
  software_version?: string | null;
  asset_number?: string | null;
  ip_address?: string | null;
  local_ae_title?: string | null;
  his_ris_info?: SystemInfo;
  dicom_info?: SystemInfo;
  mri_embedded_parameters?: MriInfo;
  connection_options?: SystemConnectionOptions;
  image_url?: string;
  documentation?: string;
  is_online?: boolean;
  last_successful_ping_at?: string | null;
  vnc_port?: string | null;
  service_page_url?: string | null;
  ssh_user?: string;
};
export type SeatList = {
  system: System;
};
export type Seat = {
  system: number;
};
export type OrganizationSeatSeriazlier = {
  seats: Seat[];
};
export type SiteCreate = {
  id?: number | null;
  name: string;
  address: string;
  modalities?: string[];
  connections?: number;
};
export type OrganizationSite = {
  id?: number;
  sites: SiteCreate[];
};
export type InfluxSystems = {
  systems: number[];
};
export type ManagerMeta = {
  email: string;
  name: string;
};
export type UserSystem = {
  system: number;
  is_read_only?: boolean;
};
export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username: string;
  is_active?: boolean;
  health_networks?: string[];
  modalities?: string[];
  organizations?: string[];
  phone?: string;
  fse_accessible?: boolean;
  audit_enabled?: boolean;
  can_leave_notes?: boolean;
  view_only?: boolean;
  is_one_time?: boolean;
  documentation_url?: boolean;
  role?: string[];
  manager?: ManagerMeta;
  image?: string;
  location?: string;
  slack_link?: string;
  calender_link?: string;
  zoom_link?: string;
  sites?: string[];
  systems?: UserSystem[];
};
export type UpsertUser = {
  meta?: MetaSerialzer;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role:
    | "fse-admin"
    | "customer-admin"
    | "user-admin"
    | "fse"
    | "end-user"
    | "cryo"
    | "cryo-fse"
    | "cryo-admin";
  manager?: number;
  organization: number;
  sites?: number[];
  modalities?: number[];
  fse_accessible: boolean;
  audit_enabled: boolean;
  can_leave_notes: boolean;
  view_only: boolean;
  is_one_time: boolean;
  documentation_url: boolean;
  systems: UserSystem[];
};
export type OrganizationUpsertUser = {
  id?: number;
  memberships: UpsertUser[];
};
export type RouterLocation = {
  system: number;
  long: string;
  lat: string;
  name?: string;
};
export type ProductCreate = {
  id?: number;
  name: string;
  manufacturer: number;
};
export type ProductModelCreate = {
  id?: number;
  model: string;
  documentation: Documentation;
  modality: number;
  product: number;
};
export type SystemImage = {
  id?: number;
  image: string;
};
export type SystemNotes = {
  id?: number;
  author: number;
  note: string;
  created_at?: string;
  author_image?: string;
  author_full_name?: string;
};
export type SystemAccess = {
  name: string;
  ip_address?: string | null;
  ssh_password?: string | null;
  ssh_user?: string;
};
export type UserEnableDisable = {
  users: number[];
};
export type UpsertUserPassword = {
  password: string;
  old_password: string;
};
export type MeUpdate = {
  first_name?: string;
  last_name?: string;
  meta?: MetaSerialzer;
};
export type Role = {
  value: string;
  title: string;
};
export type Folder = {
  id?: number;
  name: string;
  categories: number[];
  document_count?: string;
};
export type Category = {
  id?: number;
  name: string;
  color?: string;
  folders?: Folder[];
};
export type ProfileMeta = {
  id?: number;
  name?: string;
  image?: string;
};
export type Comment = {
  id?: number;
  topic?: number;
  user?: number;
  comment: string;
  user_profile?: ProfileMeta;
  created_at?: string;
  number_of_replies?: number;
};
export type Document = {
  id?: number;
  title: string;
  text: string;
  folder?: number | null;
  favorite?: boolean;
  categories: number[];
  document_link?: string | null;
  created_by?: number;
};
export type FolderDetail = {
  id?: number;
  name: string;
  categories: number[];
  documents: Document[];
};
export type TopicCategory = {
  id?: number;
  name: string;
  color?: string;
  folders: number[];
};
export type TopicDetail = {
  id?: number;
  user?: ProfileMeta;
  title: string;
  description: string;
  followers?: ProfileMeta[];
  image?: string | null;
  categories: TopicCategory[];
  reply_email_notification?: boolean;
  number_of_followers?: number;
  number_of_comments?: number;
  created_at?: string;
  updated_at?: string;
};
export type Topic = {
  id?: number;
  user?: number;
  title: string;
  description: string;
  followers?: ProfileMeta[];
  image?: string | null;
  categories?: number[];
  reply_email_notification?: boolean;
  number_of_followers?: number;
  number_of_comments?: number;
  created_at?: string;
  updated_at?: string;
};
export type FollowUnfollow = {
  follow: boolean;
};
export type RecentActivity = {
  id?: number;
  user?: ProfileMeta;
  topic: number;
  action: string;
  created_at?: string;
};
export type SystemMeta = {
  name: string;
  image_url?: string;
};
export type WorkOrderDetail = {
  system: SystemMeta;
  description: string;
  work_started?: boolean;
  work_completed?: boolean;
};
export type WorkOrder = {
  system: number;
  description: string;
  work_started?: boolean;
  work_completed?: boolean;
};
export type WebSshLog = {
  system: number;
  user?: number | null;
  log: string;
};
export const {
  useAccountsRequestsCreateMutation,
  useHealthNetworksListQuery,
  useManufacturersListQuery,
  useManufacturersCreateMutation,
  useManufacturersImagesListQuery,
  useManufacturersImagesCreateMutation,
  useModalitiesManufacturersListQuery,
  useNotesPartialUpdateMutation,
  useNotesDeleteMutation,
  useOrganizationsListQuery,
  useOrganizationsCreateMutation,
  useOrganizationsExistsReadQuery,
  useOrganizationsReadQuery,
  useOrganizationsPartialUpdateMutation,
  useOrganizationsDeleteMutation,
  useOrganizationsAssociatedSitesListQuery,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsHealthNetworksCreateMutation,
  useOrganizationsHealthNetworksUpdateMutation,
  useOrganizationsMeReadQuery,
  useOrganizationsModalitiesListQuery,
  useOrganizationsSeatsListQuery,
  useOrganizationsSeatsCreateMutation,
  useOrganizationsSitesListQuery,
  useOrganizationsSitesCreateMutation,
  useOrganizationsSitesUpdateMutation,
  useOrganizationsSystemsListQuery,
  useOrganizationsSystemsCreateMutation,
  useOrganizationsSystemsUpdateMutation,
  useOrganizationsSystemsPartialUpdateMutation,
  useOrganizationsSystemsDeleteMutation,
  useOrganizationsSystemsUpdateFromInfluxMutation,
  useOrganizationsUsersListQuery,
  useOrganizationsUsersCreateMutation,
  useOrganizationsSystemsLocationsListQuery,
  useProductsListQuery,
  useProductsCreateMutation,
  useProductsModelsListQuery,
  useProductsModelsCreateMutation,
  useProductsModelsPartialUpdateMutation,
  useProductsModelsDeleteMutation,
  useProductsPartialUpdateMutation,
  useProductsDeleteMutation,
  useScopeUsersListQuery,
  useScopeUsersCreateMutation,
  useSystemsImagesListQuery,
  useSystemsImagesCreateMutation,
  useSystemsInfluxdbListQuery,
  useSystemsNotesListQuery,
  useSystemsNotesCreateMutation,
  useSystemsSshPasswordReadQuery,
  useSystemsChatbotListQuery,
  useSystemsChatbotCreateMutation,
  useUsersActivatePartialUpdateMutation,
  useUsersActiveUsersListQuery,
  useUsersChangePasswordPartialUpdateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersMePartialUpdateMutation,
  useUsersRolesListQuery,
  useUsersPartialUpdateMutation,
  useVfseCategoriesListQuery,
  useVfseCategoriesCreateMutation,
  useVfseCategoriesReadQuery,
  useVfseCategoriesPartialUpdateMutation,
  useVfseCategoriesDeleteMutation,
  useVfseCommentsRepliesListQuery,
  useVfseCommentsRepliesCreateMutation,
  useVfseDashboardListQuery,
  useVfseDocumentsListQuery,
  useVfseDocumentsCreateMutation,
  useVfseDocumentsReadQuery,
  useVfseDocumentsPartialUpdateMutation,
  useVfseDocumentsDeleteMutation,
  useVfseFoldersListQuery,
  useVfseFoldersCreateMutation,
  useVfseFoldersReadQuery,
  useVfseFoldersPartialUpdateMutation,
  useVfseFoldersDeleteMutation,
  useVfseTopicsListQuery,
  useVfseTopicsCreateMutation,
  useVfseTopicsPopularListQuery,
  useVfseTopicsReadQuery,
  useVfseTopicsPartialUpdateMutation,
  useVfseTopicsDeleteMutation,
  useVfseTopicsCommentsListQuery,
  useVfseTopicsCommentsCreateMutation,
  useVfseTopicsFollowPartialUpdateMutation,
  useVfseUserActivityListQuery,
  useVfseUserMeActivityListQuery,
  useVfseUserTopicListQuery,
  useVfseWorkordersListQuery,
  useVfseWorkordersCreateMutation,
  useVfseWorkordersReadQuery,
  useWebsshlogListQuery,
  useWebsshlogCreateMutation,
} = injectedRtkApi;
