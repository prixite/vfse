import Documentation from "@src/views/documentation/DocumentationView";
import Modality from "@src/views/modality/ModalityView";
import Organization from "@src/views/organization/OrganizationView";
import User from "@src/views/user/UserView";
import Vfse from "@src/views/vfse/VfseView";
import Home from "@src/views/home/HomeView";
import { routeItem } from "@src/helpers/interfaces";
export const routes: routeItem[] = [
  { name: "Home", path: "/", component: Home },
  {
    name: "3rd party administration",
    path: "/organizations/",
    component: Organization,
  },
  { name: "Users", path: "/users/", component: User },
  { name: "Modality", path: "/modality/", component: Modality },
  { name: "Documentation", path: "/documentation/", component: Documentation },
  { name: "vFSE", path: "/vfse/", component: Vfse },
];
