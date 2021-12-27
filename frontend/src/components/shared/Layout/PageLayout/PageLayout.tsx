import { ReactChildren, ReactChild } from "react";

import "@src/components/shared/Layout/PageLayout/PageLayout.scss";
import SideBar from "@src/components/shared/Layout/SideBar/SideBar";

interface LayoutProps {
  children: ReactChild | ReactChildren;
}
const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="Layout">
      <SideBar />
      {children}
    </div>
  );
};

export default PageLayout;
