import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Tag, Typography } from 'antd';
import LeaveTypeModal from './LeaveTypeModal';

const { Title, Text } = Typography;

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Default Allocation (days)',
    dataIndex: 'defaultAllocationDays',
    key: 'defaultAllocationDays',
  },
  {
    title: 'Draws From Balance',
    dataIndex: 'drawsFromBalance',
    key: 'drawsFromBalance',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    title: 'Requires Approval',
    dataIndex: 'requiresApproval',
    key: 'requiresApproval',
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    title: 'Two-Step Threshold (days)',
    dataIndex: 'twoStepThresholdDays',
    key: 'twoStepThresholdDays',
    render: (value) => value ?? '—',
  },
  {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (value) => (
      <Tag color={value ? 'green' : 'default'}>
        {value ? 'Active' : 'Inactive'}
      </Tag>
    ),
  },
];

const AdminLeaveTypesPage = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (values) => {
    setLeaveTypes((prev) => [...prev, { id: prev.length + 1, ...values }]);
    setModalOpen(false);
  };

  return (
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Add Leave Type
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={leaveTypes}
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

      <LeaveTypeModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminLeaveTypesPage;
