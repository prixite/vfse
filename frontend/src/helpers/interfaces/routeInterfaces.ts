import { ReactNode } from "react";

import SvgIcon from "@mui/material/SvgIcon/SvgIcon";

interface routeItem {
  name?: string | undefined;
  path: string;
  component: ReactNode;
  flag: string;
  icon: typeof SvgIcon;
}

export type { routeItem };
