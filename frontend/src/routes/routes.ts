import Documentation from "@src/views/documentation/DocumentationView";
import ModalityView from "@src/views/modality/ModalityView";
import OrganizationView from "@src/views/organization/OrganizationView";
import UserView from "@src/views/user/UserView";
import VfseView from "@src/views/vfse/VfseView";
import HomeView from "@src/views/home/HomeView";
import { routeItem } from "@src/helpers/interfaces";
export const routes: routeItem[] = [
  { name: "Home", path: "/", component: HomeView },
  {
    name: "3rd party administration",
    path: "/organizations/",
    component: OrganizationView,
  },
  { name: "Users", path: "/users/", component: UserView },
  { name: "Modality", path: "/modality/", component: ModalityView },
  { name: "Documentation", path: "/documentation/", component: Documentation },
  { name: "vFSE", path: "/vfse/", component: VfseView },
];
