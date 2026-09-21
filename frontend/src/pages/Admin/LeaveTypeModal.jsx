import { useEffect } from 'react';
import {
  Alert,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
  Typography,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

const DEFAULT_VALUES = {
  name: '',
  description: '',
  defaultAllocationDays: 20,
  drawsFromBalance: true,
  requiresApproval: true,
  twoStepThresholdDays: null,
  isActive: true,
};

const LeaveTypeModal = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  confirmLoading,
  error,
}) => {
  const [form] = Form.useForm();
  const requiresApproval = Form.useWatch('requiresApproval', form);
  const isEditing = Boolean(initialValues);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ ...DEFAULT_VALUES, ...initialValues });
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        twoStepThresholdDays: values.requiresApproval
          ? values.twoStepThresholdDays
          : null,
      });
    });
  };

  return (
    <Modal
      title={isEditing ? 'Edit Leave Type' : 'Add Leave Type'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={isEditing ? 'Save Changes' : 'Add Leave Type'}
      confirmLoading={confirmLoading}
      destroyOnHidden
      mask={false}
      width={680}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form form={form} layout="vertical" initialValues={DEFAULT_VALUES}>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please enter a leave type name' },
                { max: 100, message: 'Name must be 100 characters or fewer' },
              ]}
            >
              <Input placeholder="e.g. Sick Leave" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="defaultAllocationDays"
              label="Default Allocation (days)"
              rules={[
                {
                  required: true,
                  message: 'Please enter a default allocation',
                },
              ]}
            >
              <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea
            rows={3}
            placeholder="Optional description shown to employees"
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="drawsFromBalance"
              label="Draws From Balance"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Requests of this type deduct from the employee&apos;s leave
                  balance.
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="requiresApproval"
              label="Requires Approval"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Requests of this type must be approved by a manager.
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          {requiresApproval && (
            <Col span={12}>
              <Form.Item
                name="twoStepThresholdDays"
                label="Two-Step Approval Threshold (days)"
                extra={
                  <Text type="secondary">
                    Requests longer than this many days require a second
                    approval on top of the first. Leave blank for single-step
                    approval only.
                  </Text>
                }
              >
                <InputNumber
                  min={0}
                  step={0.5}
                  style={{ width: '100%' }}
                  placeholder="Single-step approval"
                />
              </Form.Item>
            </Col>
          )}

          <Col span={requiresApproval ? 12 : 24}>
            <Form.Item
              name="isActive"
              label="Active"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Inactive leave types are hidden from new requests but remain
                  on past records.
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default LeaveTypeModal;
