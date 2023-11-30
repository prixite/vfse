import { lazy } from "react";

import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";

import { routeItem } from "@src/types/interfaces";

const OrganizationView = lazy(
  async () =>
    import(
      /* webpackChunkName: "OrganizationView" */ "@src/views/organization/OrganizationView"
    )
);
const SystemsView = lazy(
  async () =>
    import(
      /* webpackChunkName: "SystemsView" */ "@src/views/systems/SystemsView"
    )
);
const AppearanceView = lazy(
  async () =>
    import(
      /* webpackChunkName: "AppearanceView" */ "@src/views/appearance/AppearanceView"
    )
);
const Documentation = lazy(
  async () =>
    import(
      /* webpackChunkName: "Documentation" */ "@src/views/documentation/DocumentationView"
    )
);
const FaqView = lazy(
  async () => import(/* webpackChunkName: "FaqView" */ "@src/views/faq/FaqView")
);
const ForumView = lazy(
  async () =>
    import(/* webpackChunkName: "ForumView" */ "@src/views/forum/ForumView")
);
const KnowledgeBaseView = lazy(
  async () =>
    import(
      /* webpackChunkName: "KnowledgeBaseView" */ "@src/views/knowledgeBase/KnowledgeBaseView"
    )
);
const UserView = lazy(
  async () =>
    import(/* webpackChunkName: "UserView" */ "@src/views/user/UserView")
);
const ProfileView = lazy(
  async () =>
    import(/* webpackChunkName: "UserView" */ "@src/views/profile/ProfileView")
);
export const routes: routeItem[] = [
  {
    name: "vFSE",
    path: "/forum/",
    component: ForumView,
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
    name: "Documentation Administration",
    path: "/documentation/",
    component: Documentation,
    flag: "documentation",
    icon: ArticleIcon,
  },
  {
    name: "Profile",
    path: "/profile/",
    component: ProfileView,
    flag: "profile",
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
