import { emptySplitApi as api } from "@src/requests/src/store/emptyApi";
const injectedRtkApi = api.injectEndpoints({
  // eslint-disable-line
  endpoints: (build) => ({
    accountsRequestsCreate: build.mutation({
      query: (queryArg) => ({
        url: `/test/url/`,
        method: "POST",
        body: queryArg.userRequestAcessSeriazlizer,
      }),
    }),
  }),
});
export { injectedRtkApi as api };
export const { useAccountsRequestsCreateMutation } = injectedRtkApi;
