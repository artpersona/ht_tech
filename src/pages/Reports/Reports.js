import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { Breadcrumb, Col, Row, Card, DatePicker, Space } from "antd";
import { useAppContext } from "../../shared/contexts/AppContext";
import { Column, Pie, Line } from "@ant-design/charts";
import moment from "moment";
function Reports() {
  const { RangePicker } = DatePicker;

  const { patients } = useAppContext();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const handleRangeChange = (range) => {
    if (range) {
      let start = range[0].subtract(1, "days");
      let end = range[1];

      let tempData = JSON.parse(JSON.stringify(patients));

      tempData = tempData.filter((item) =>
        moment(item.reporting_date).isBetween(start, end)
      );
      console.log("temp data is: ", tempData);
      setFilteredPatients(tempData);
    } else {
      setFilteredPatients(patients);
    }
  };

  useEffect(() => {
    let tempLineData = findOcc(filteredPatients, "reporting_date");
    let tempBarData = findOcc(filteredPatients, "diagnosis");
    let tempData = JSON.parse(JSON.stringify(tempBarData));
    let tempPieData = tempData.map((item) => {
      item.occurrence = (item.occurrence / tempBarData.length) * 100;
      return item;
    });
    setLineData(tempLineData);
    setBarData(tempBarData);
    setPieData(tempPieData);
  }, [filteredPatients]);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  function findOcc(arr, key) {
    let arr2 = [];

    arr.forEach((x) => {
      // Checking if there is any object in arr2
      // which contains the key value
      if (
        arr2.some((val) => {
          return val[key] == x[key];
        })
      ) {
        // If yes! then increase the occurrence by 1
        arr2.forEach((k) => {
          if (k[key] === x[key]) {
            k["occurrence"]++;
          }
        });
      } else {
        // If not! Then create a new object initialize
        // it with the present iteration key's value and
        // set the occurrence to 1
        let a = {};
        a[key] = x[key];
        a["occurrence"] = 1;
        arr2.push(a);
      }
    });

    return arr2;
  }

  const config = {
    data: barData,
    width: 550,
    height: 400,
    autoFit: false,
    xField: "diagnosis",
    yField: "occurrence",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  const lineConfig = {
    data: lineData,
    width: 1200,
    height: 400,
    autoFit: false,
    xField: "reporting_date",
    yField: "occurrence",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "occurrence",
    colorField: "diagnosis",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };

  let chart;
  return (
    <Layout>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Reports</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        <Space direction="vertical" size={12}>
          <RangePicker onChange={handleRangeChange} />
        </Space>
        <Row>
          <Col span={24}>
            <Card title="Cumulative Cases" style={{ marginBottom: "5%" }}>
              <Line {...lineConfig} />;
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Card title="Number per cases">
              <Column
                {...config}
                onReady={(chartInstance) => (chart = chartInstance)}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Diseae Type Breakdown">
              <Pie {...pieConfig} />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default Reports;
