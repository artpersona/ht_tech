import React from "react";
import Layout from "../../Layout/Layout";
import { Breadcrumb, Button, Row, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ExcelExport from "export-xlsx";
import { SETTINGS_FOR_EXPORT } from "./ExportSettings";
const data = [
  {
    data: [
      {
        id: 1,
        level: 0,
        number: "0001",
        name: "0001",
        a: 50,
        b: 45,
        total: 95,
      },
      {
        id: 2,
        parentId: 1,
        level: 1,
        number: "0001-1",
        name: "0001-1",
        a: 20,
        b: 25,
        total: 45,
      },
      {
        id: 3,
        parentId: 2,
        level: 1,
        number: "0001-2",
        name: "0001-2",
        a: 30,
        b: 20,
        total: 50,
      },
      {
        id: 4,
        level: 0,
        number: "0002",
        name: "0002",
        a: 40,
        b: 40,
        total: 80,
      },
    ],
  },
];

function Exports() {
  const handleExport = () => {
    const excelExport = new ExcelExport();
    excelExport.downloadExcel(SETTINGS_FOR_EXPORT, data);
    console.log("fucker clicked!");
  };
  return (
    <Layout>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Report Exports</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        <Space style={{ flexDirection: "column" }} align="baseline">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Download Weekly Report
          </Button>

          <Button type="primary" icon={<DownloadOutlined />}>
            Download Monthly Report
          </Button>

          <Button type="primary" icon={<DownloadOutlined />}>
            Download Quarterly Report
          </Button>

          <Button type="primary" icon={<DownloadOutlined />}>
            Download Yearly Report
          </Button>
        </Space>
      </div>
    </Layout>
  );
}

export default Exports;
