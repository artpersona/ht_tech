import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Sider } = Layout;
function SideBar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const { loggedUser, logoutUser } = useAuthContext();

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
      <div className="logo">{loggedUser?.userType}</div>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="2" icon={<TeamOutlined />}>
          <Link to="/patients">Patient Management</Link>
        </Menu.Item>

        <SubMenu key="sub1" icon={<UserOutlined />} title="Reports">
          <Menu.Item key="3">
            <Link to="/reports">Communicable Disease Cases</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="4" icon={<TeamOutlined />}>
          <Link to="/exports">Exports</Link>
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<LogoutOutlined color="white" />}
          style={{ backgroundColor: "#D11A2A ", marginTop: "5%" }}
          color="white"
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SideBar;
