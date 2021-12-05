import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "swagger.json",
  apiFile: "@src/store/emptyApi.ts",
  apiImport: "emptySplitApi",
  outputFile: "./src/store/reducers/api.ts",
  exportName: "api",
  hooks: true,
};

export default config;
