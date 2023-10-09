export const constants = {
  organizationRoute: "clients",
  networkRoute: "networks",
  sitesRoute: "sites",
  systemsRoute: "systems",
  userRoute: "user",
};
export const timeOut = 2000;

export const organizationTabs = ["Networks", "Sites"];
export const superAdmin = "super_admin";
export const workOrderTabs = ["All", "MRI", "Mammograph", "CT"];
export const topicsTabs = ["All", "Followed", "Created"];
export const categories = [
  "CT",
  "CTI",
  "MAMMO",
  "US",
  "XR",
  "SPECT",
  "PEM",
  "RGS",
  "USI",
  "XRI",
  "ABF",
  "DFS",
  "GFD",
];

export const COLUMN_METADATA = {
  MODEL: { header: "MODEL NAME", field: "model" },
  SYSTEM_NAME: { header: "SYSTEM NAME", field: "name" },
  MANUFACTURER: { header: "MANUFACTURER", field: "manufacturer" },
  MODALITY: { header: "MODALITY", field: "modality" },
  DOCUMENTATION: { header: "DOCUMENTATION LINK", field: "documentation" },
};

export const USER_TABLE_METADATA = {
  FIRST_NAME: { header: "First Name", field: "first_name" },
  LAST_NAME: { header: "Last Name", field: "last_name" },
  USERNAME: { header: "Username", field: "username" },
  EMAIL: { header: "Email", field: "email" },
  PHONE: { header: "Phone", field: "phone" },
  ROLE: { header: "Role", field: "role" },
  MANAGER: { header: "Manager", field: "manager" },
  CUSTOMER: { header: "Customer", field: "customer" },
  MODALITIES: { header: "Modalities", field: "modalities" },
  SITES: { header: "Sites", field: "sites" },
  STATUS: { header: "Status", field: "status" },
};
