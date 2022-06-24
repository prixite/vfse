import { ReactChildren, ReactChild } from "react";

import "@src/components/shared/layout/pageLayout/pageLayout.scss";
import SideBar from "@src/components/shared/layout/sideBar/SideBar";

interface LayoutProps {
  children: ReactChild | ReactChildren;
}
const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="Layout">
      <SideBar />
      {children}
      {/* <Outlet /> */}
    </div>
  );
};

export default PageLayout;
