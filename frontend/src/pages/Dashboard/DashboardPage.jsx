import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const { Title, Text } = Typography;

const columns = [
  { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
  { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
  { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Welcome back, {user?.name}
      </Title>
      <Text type="secondary">
        Here&apos;s where your leave balance and requests will live.
      </Text>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Annual Leave Balance" value={0} suffix="days" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Sick Leave Balance" value={0} suffix="days" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Pending Requests" value={0} />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 24 }}
        title="Recent Requests"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Request
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
                description="No leave requests yet"
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
