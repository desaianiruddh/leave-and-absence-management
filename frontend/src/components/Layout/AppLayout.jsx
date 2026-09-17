import { useMemo } from 'react';
import {
  CalendarOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, Space, Tag, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import { hasPermission } from '../../rbac/permissions';
import { NAV_ITEMS } from '../../rbac/navConfig';

const { Header, Content } = Layout;
const { Text } = Typography;

const ROLE_COLORS = {
  employee: 'blue',
  manager: 'purple',
  admin: 'volcano',
};

const AppLayout = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasPermission(user?.role, item.permission),
  );

  const menuItems = useMemo(
    () => visibleNavItems.map((item) => ({ key: item.to, label: item.label })),
    [visibleNavItems],
  );

  const selectedKey =
    visibleNavItems.find((item) => location.pathname.startsWith(item.to))?.to ??
    '';

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Log out',
      icon: <LogoutOutlined />,
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          paddingInline: 24,
        }}
      >
        <Space size={8} style={{ whiteSpace: 'nowrap' }}>
          <CalendarOutlined style={{ fontSize: 20, color: '#2952cc' }} />
          <Text strong style={{ fontSize: 16 }}>
            Leave &amp; Absence
          </Text>
        </Space>

        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderBottom: 'none', minWidth: 0 }}
        />

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>
              <Text>{user?.firstName}</Text>{' '}
              <Tag
                color={ROLE_COLORS[user?.role] || 'default'}
                style={{ textTransform: 'capitalize' }}
              >
                {user?.role}
              </Tag>
            </span>
            <DownOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: 24 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
