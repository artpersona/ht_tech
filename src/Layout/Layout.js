import React from "react";
import { Layout } from "antd";
import { SideBar } from "../components";
import "./styles.css";

const { Header, Content, Footer } = Layout;

function Home({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar />
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>Healthcare Tech @2022</Footer>
      </Layout>
    </Layout>
  );
}

export default Home;
