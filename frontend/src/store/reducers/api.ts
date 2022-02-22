import { rtk } from "@src/store/reducers/generated";

const enhancedRtkApi = rtk.enhanceEndpoints({
  addTagTypes: ["User", "Organization"],
  endpoints: {
    organizationsList: {
      providesTags: ["Organization"],
    },
    organizationsCreate: {
      invalidatesTags: ["Organization"],
    },
  },
});

export * from "@src/store/reducers/generated";
export { enhancedRtkApi as api };
