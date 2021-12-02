import React from "react";
import { ToastContainer } from "react-toastify";
import "@src/App.scss";
import Layout from "@src/components/Layout/Layout";
import Content from "@src/components/Content";
export default function App() {
  return (
    <>
      <ToastContainer />
      <Layout>
        <Content />
      </Layout>
    </>
  );
}
