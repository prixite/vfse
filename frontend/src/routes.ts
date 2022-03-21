import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";

import { routeItem } from "@src/helpers/interfaces/routeInterfaces";
import AppearanceView from "@src/views/appearance/AppearanceView";
import Documentation from "@src/views/documentation/DocumentationView";
// import ModalityView from "@src/views/modality/ModalityView";
import FaqView from "@src/views/faq/FaqView";
import ForumView from "@src/views/forum/ForumView";
import KnowledgeBaseView from "@src/views/knowledgeBase/KnowledgeBaseView";
import OrganizationView from "@src/views/organization/OrganizationView";
import SystemsView from "@src/views/systems/SystemsView";
import UserView from "@src/views/user/UserView";

export const routes: routeItem[] = [
  {
    name: "vFSE",
    path: "/faq/",
    component: FaqView,
    flag: "vfse",
    icon: HomeIcon,
  },
  {
    name: "Appearance",
    path: "/appearance/",
    component: AppearanceView,
    flag: "appearance",
    icon: CategoryIcon,
  },
  {
    name: "Modality Administration",
    path: "/systems/",
    component: SystemsView,
    flag: "modality",
    icon: FolderOpenOutlinedIcon,
  },
  {
    name: "Organization Administration",
    path: "/",
    component: OrganizationView,
    flag: "organization",
    icon: CorporateFareIcon,
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
];

export const vfseRoutes: routeItem[] = [
  {
    name: "Knowledge Base",
    path: "/knowledge-base/",
    component: KnowledgeBaseView,
    flag: "knowledge",
    icon: HomeIcon,
  },
  {
    name: "Forum",
    path: "/forum/",
    component: ForumView,
    flag: "forum",
    icon: HomeIcon,
  },
  {
    name: "FAQ",
    path: "/faq/",
    component: FaqView,
    flag: "faq",
    icon: HomeIcon,
  },
];
