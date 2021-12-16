import Documentation from "@src/views/documentation/DocumentationView";
import ModalityView from "@src/views/modality/ModalityView";
import OrganizationView from "@src/views/organization/OrganizationView";
import UserView from "@src/views/user/UserView";
import VfseView from "@src/views/vfse/VfseView";
import AppearanceView from "./views/appearance/AppearanceView";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
export const routes: routeItem[] = [
  {
    name: "Appearance",
    path: "/appearance/",
    component: AppearanceView,
    flag: "all",
    icon: CategoryIcon,
  },
  {
    name: "Modality Administration",
    path: "/networks/",
    component: ModalityView,
    flag: "modality",
    icon: HomeIcon,
  },
  {
    name: "3rd party administration",
    path: "/",
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
