import { useEffect } from 'react';
import { Card, Empty, Table, Tag, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  selectUsersError,
  selectUsersList,
  selectUsersStatus,
} from '../../features/users/usersSlice';

const { Title, Text } = Typography;

const ROLE_COLORS = {
  employee: 'blue',
  manager: 'purple',
  admin: 'volcano',
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name) => name || '—',
  },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => (
      <Tag
        color={ROLE_COLORS[role] || 'default'}
        style={{ textTransform: 'capitalize' }}
      >
        {role}
      </Tag>
    ),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    render: (department) => department || '—',
  },
  {
    title: 'Manager',
    dataIndex: 'manager',
    key: 'manager',
    render: (manager) => manager || '—',
  },
];

const UsersListPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Users
      </Title>
      <Text type="secondary">View all users across the organization.</Text>

      <Card style={{ marginTop: 24 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={status === 'loading'}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={error || 'No users found'}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default UsersListPage;
