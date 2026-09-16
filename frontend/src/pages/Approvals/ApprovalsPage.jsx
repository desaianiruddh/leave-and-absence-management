import { Card, Empty, Table, Typography } from 'antd';

const { Title, Text } = Typography;

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
  { title: 'Dates', dataIndex: 'dates', key: 'dates' },
  { title: 'Reason', dataIndex: 'reason', key: 'reason' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

const ApprovalsPage = () => (
  <div>
    <Title level={3} style={{ marginBottom: 4 }}>
      Approval Queue
    </Title>
    <Text type="secondary">
      Pending requests from your direct reports will appear here.
    </Text>

    <Card style={{ marginTop: 24 }}>
      <Table
        columns={columns}
        dataSource={[]}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No pending approvals"
            />
          ),
        }}
      />
    </Card>
  </div>
);

export default ApprovalsPage;
