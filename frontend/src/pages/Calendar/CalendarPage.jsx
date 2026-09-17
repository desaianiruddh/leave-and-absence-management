import { Calendar, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const CalendarPage = () => (
  <div>
    <Title level={3} style={{ marginBottom: 4 }}>
      Team Calendar
    </Title>
    <Text type="secondary">
      Approved and pending leave for your team will appear here.
    </Text>

    <Card style={{ marginTop: 24 }}>
      <Calendar fullscreen={false} />
    </Card>
  </div>
);

export default CalendarPage;
