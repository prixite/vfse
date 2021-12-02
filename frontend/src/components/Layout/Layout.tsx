import React, { ReactChildren, ReactChild } from "react";
import "./Layout.scss";
import SideBar from "@src/components/Layout/SideBar/SideBar";

interface LayoutProps {
  children: ReactChild | ReactChildren;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="Layout">
      <SideBar />
      {children}
    </div>
  );
};

export default Layout;
