import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Typography } from 'antd';

const { Title, Text } = Typography;

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Draws From Balance',
    dataIndex: 'drawsFromBalance',
    key: 'drawsFromBalance',
  },
  {
    title: 'Requires Approval',
    dataIndex: 'requiresApproval',
    key: 'requiresApproval',
  },
  {
    title: 'Default Allowance',
    dataIndex: 'defaultAllowance',
    key: 'defaultAllowance',
  },
];

const AdminLeaveTypesPage = () => (
  <div>
    <Title level={3} style={{ marginBottom: 4 }}>
      Leave Types
    </Title>
    <Text type="secondary">
      Configure leave types, approval rules, and default allowances.
    </Text>

    <Card
      style={{ marginTop: 24 }}
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Add Leave Type
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={[]}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No leave types configured"
            />
          ),
        }}
      />
    </Card>
  </div>
);

export default AdminLeaveTypesPage;
