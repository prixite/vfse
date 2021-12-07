import React, { ReactChildren, ReactChild } from "react";
import "./PageLayout.scss";
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
