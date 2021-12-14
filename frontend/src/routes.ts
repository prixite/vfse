import Documentation from "@src/views/documentation/DocumentationView";
import ModalityView from "@src/views/modality/ModalityView";
import OrganizationView from "@src/views/organization/OrganizationView";
import UserView from "@src/views/user/UserView";
import VfseView from "@src/views/vfse/VfseView";
import HomeView from "@src/views/home/HomeView";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
export const routes: routeItem[] = [
  {
    name: "3rd party administration",
    path: "/organizations/",
    component: OrganizationView,
    flag: "organization",
    icon: HomeIcon,
  },
  {
    name: "User Administration",
    path: "/users/",
    component: UserView,
    flag: "user",
    icon: GroupIcon,
  },
  {
    name: "Modality",
    path: "/modality/",
    component: ModalityView,
    flag: "modality",
    icon: HomeIcon,
  },
  {
    name: "Documentation database",
    path: "/documentation/",
    component: Documentation,
    flag: "documentation",
    icon: ArticleIcon,
  },
  {
    name: "vFSE",
    path: "/vfse/",
    component: VfseView,
    flag: "vfse",
    icon: HomeIcon,
  },
];
