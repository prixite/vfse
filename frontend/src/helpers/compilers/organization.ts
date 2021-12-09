import { Organization } from "@src/store/reducers/api";

function compileOrganizationColorObject(
  organizationData: Organization,
  color: string,
  colorType: string
) {
  organizationData.appearance[colorType] = color;
  return organizationData;
}

export { compileOrganizationColorObject };
