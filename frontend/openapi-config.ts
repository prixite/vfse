import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "swagger.json",
  apiFile: "@src/store/emptyApi.ts",
  apiImport: "emptyApi",
  outputFile: "./src/store/api.ts",
  exportName: "api",
  hooks: true,
};

export default config;
