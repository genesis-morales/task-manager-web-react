import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Input, Badge, Button, Tooltip } from "antd";
import {
  ProjectOutlined,
  ClockCircleOutlined,
  StarOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import type { MenuProps } from "antd";
import "./AppShell.scss";

const { Sider, Header, Content } = Layout;
const { Search } = Input;

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems: MenuProps["items"] = [
    {
      key: "/projects",
      icon: <ProjectOutlined />,
      label: "Projects",
    },
    {
      key: "recent",
      icon: <ClockCircleOutlined />,
      label: "Recent",
      disabled: true,
    },
    {
      key: "starred",
      icon: <StarOutlined />,
      label: "Starred",
      disabled: true,
    },
  ];

  const bottomItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      disabled: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key.startsWith("/")) {
      navigate(e.key);
    }
  };

  const activeKey = navItems?.find((item) =>
    item && "key" in item && typeof item.key === "string" && location.pathname.startsWith(item.key)
  )?.key as string || "/projects";

  return (
    <Layout className="app-shell">
      <Sider width={240} className="app-shell__sidebar" breakpoint="lg" collapsedWidth={0}>
        {/* Logo */}
        <div className="app-shell__logo" onClick={() => navigate("/projects")} role="button" tabIndex={0}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="app-shell__logo-text">Workspace Flow</span>
        </div>

        {/* Nav Menu */}
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={navItems}
          onClick={handleMenuClick}
          className="app-shell__menu"
        />

        {/* Bottom */}
        <div className="app-shell__bottom">
          <Menu
            mode="inline"
            selectable={false}
            items={bottomItems}
            className="app-shell__menu app-shell__menu--bottom"
          />

          {/* Theme toggle */}
          <Tooltip title={theme === "dark" ? "Switch to light" : "Switch to dark"} placement="right">
            <Button
              type="text"
              icon={
                theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round"/>
                    <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round"/>
                    <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round"/>
                  </svg>
                )
              }
              onClick={toggleTheme}
              className="app-shell__theme-btn"
              block
            >
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </Button>
          </Tooltip>

          {/* User */}
          <div className="app-shell__user">
            <Avatar size={36} className="app-shell__user-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <div className="app-shell__user-info">
              <span className="app-shell__user-name">{user?.username || "User"}</span>
              <Button type="link" size="small" danger onClick={handleLogout} icon={<LogoutOutlined />} className="app-shell__logout">
                Log out
              </Button>
            </div>
          </div>
        </div>
      </Sider>

      {/* Main area */}
      <Layout className="app-shell__main-area">
        <Header className="app-shell__header">
          <Search
            placeholder="Search projects, notes, tasks..."
            className="app-shell__search"
            allowClear
          />
          <div className="app-shell__header-actions">
            <Badge count={0} dot>
              <Button type="text" icon={<BellOutlined />} className="app-shell__notification-btn" />
            </Badge>
          </div>
        </Header>

        <Content className="app-shell__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
