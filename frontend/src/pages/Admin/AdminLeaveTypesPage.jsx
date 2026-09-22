import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import LeaveTypeModal from './LeaveTypeModal';
import {
  addLeaveType,
  deleteLeaveType,
  fetchLeaveTypes,
  selectLeaveTypesAddStatus,
  selectLeaveTypesDeleteStatus,
  selectLeaveTypesError,
  selectLeaveTypesList,
  selectLeaveTypesStatus,
  selectLeaveTypesUpdateStatus,
  updateLeaveType,
} from '../../features/leaveTypes/leaveTypesSlice';

const { Title, Text } = Typography;

const buildColumns = ({ onEdit, onDelete, deleteStatus }) => [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: { showTitle: false },
    render: (value) =>
      value ? (
        <Tooltip title={value} placement="bottomLeft">
          <span>{value}</span>
        </Tooltip>
      ) : (
        '—'
      ),
  },
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
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Tooltip title="Edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Popconfirm
          title="Delete leave type"
          description={`Are you sure you want to delete "${record.name}"?`}
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(record)}
        >
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteStatus === 'loading'}
            />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];

const AdminLeaveTypesPage = () => {
  const dispatch = useDispatch();
  const leaveTypes = useSelector(selectLeaveTypesList);
  const status = useSelector(selectLeaveTypesStatus);
  const addStatus = useSelector(selectLeaveTypesAddStatus);
  const updateStatus = useSelector(selectLeaveTypesUpdateStatus);
  const deleteStatus = useSelector(selectLeaveTypesDeleteStatus);
  const error = useSelector(selectLeaveTypesError);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);

  useEffect(() => {
    dispatch(fetchLeaveTypes());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingLeaveType(null);
    setModalOpen(true);
  };

  const handleEditClick = (record) => {
    setEditingLeaveType(record);
    setModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    dispatch(deleteLeaveType(record.id));
  };

  const handleSubmit = (values) => {
    if (editingLeaveType) {
      dispatch(updateLeaveType({ id: editingLeaveType.id, ...values })).then(
        (action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            setModalOpen(false);
            setEditingLeaveType(null);
          }
        },
      );
      return;
    }

    dispatch(addLeaveType(values)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setModalOpen(false);
      }
    });
  };

  const columns = buildColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    deleteStatus,
  });

  const modalStatus = editingLeaveType ? updateStatus : addStatus;

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
            onClick={handleAddClick}
          >
            Add Leave Type
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={leaveTypes}
          loading={status === 'loading'}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  status === 'failed' ? error : 'No leave types configured'
                }
              />
            ),
          }}
        />
      </Card>

      <LeaveTypeModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingLeaveType(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingLeaveType}
        confirmLoading={modalStatus === 'loading'}
        error={modalStatus === 'failed' ? error : null}
      />
    </div>
  );
};

export default AdminLeaveTypesPage;
