import { Site } from "@src/store/reducers/generated";

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
}

export interface SiteModalFormState {
  siteName: string;
  siteAddress: string;
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
