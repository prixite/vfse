import Documentation from "@src/views/documentation/DocumentationView";
import ModalityView from "@src/views/modality/ModalityView";
import OrganizationView from "@src/views/organization/OrganizationView";
import UserView from "@src/views/user/UserView";
import VfseView from "@src/views/vfse/VfseView";
import HomeView from "@src/views/home/HomeView";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
export const routes: routeItem[] = [
  {
    name: "3rd party administration",
    path: "/organizations/",
    component: OrganizationView,
    flag: "organization",
  },
  { name: "Users", path: "/users/", component: UserView, flag: "user" },
  {
    name: "Modality",
    path: "/modality/",
    component: ModalityView,
    flag: "modality",
  },
  {
    name: "Documentation",
    path: "/documentation/",
    component: Documentation,
    flag: "documentation",
  },
  { name: "vFSE", path: "/vfse/", component: VfseView, flag: "vfse" },
];
