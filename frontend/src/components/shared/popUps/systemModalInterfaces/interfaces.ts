import {
  HealthNetwork,
  Modality,
  Product,
  Site,
} from "@src/store/reducers/generated";

export interface FormState {
  systemImage: number;
  modality: string;
  manufacturer: string;
  product: string;
  model: string;
  name: string;
  site: string;
  serialNumber: string;
  buildingLocation: string;
  version: string;
  ip: string;
  asset: string;
  localAE: string;
  connection: {
    vfse: boolean;
    ssh: boolean;
    web: boolean;
    virtual: boolean;
  };
  sshUser: string;
  sshPassword: string;
  telnetUser: string;
  telnetPassword: string;
  vncServerPath: string;
  vncPort: number;
  contactInfo: string;
  grafana: string;
  ris: {
    ip: string;
    title: string;
    port?: number;
    ae: string;
  };
  dicom: {
    ip: string;
    title: string;
    port?: number;
    ae: string;
  };
  mri: {
    helium: string;
    magnet: string;
  };
  connectionMonitoring: boolean;
}

export interface SiteModalFormState {
  siteName: string;
  siteAddress: string;
}
export interface OrganizationModalFormState {
  organizationName: string;
  organizationSeats: string;
  organizationLogo: string;
  networks: HealthNetwork[];
  sidebarColor: string;
  sidebarTextColor: string;
  ButtonTextColor: string;
  ButtonColor: string;
  secondColor: string;
  fontone: string;
  fonttwo: string;
}
export interface DocumentationModalFormState {
  docLink: string;
  modelName: string;
  modality: Modality;
  modal: Product;
}
export interface NetworkModalFormState {
  networkName: string;
  networkLogo: string;
  sitePointer: Site[];
}
export interface AppearanceFormState {
  sidebarColor: string;
  sidebarContentColor: string;
  buttonColor: string;
  buttonContentColor: string;
  secondColor: string;
  sideBarFont: string;
  mainContentFont: string;
}
