const pool = require('../config/db');
const {
  ADD_LEAVE_TYPE,
  GET_LEAVE_TYPE,
} = require('../services/leaveTypeQuery');

const addLeaveTypeController = async (req, res) => {
  const {
    name,
    description,
    defaultAllocationDays,
    drawsFromBalance,
    requiresApproval,
    twoStepThresholdDays,
    isActive,
  } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Leave type name is required' });
  }
  if (defaultAllocationDays === undefined || defaultAllocationDays === null) {
    return res
      .status(400)
      .json({ error: 'Default allocation days is required' });
  }

  try {
    const { rows } = await pool.query(ADD_LEAVE_TYPE, [
      name,
      description,
      defaultAllocationDays,
      drawsFromBalance,
      requiresApproval,
      twoStepThresholdDays,
      isActive,
    ]);
    res.json({
      message: 'Leave type added successfully',
      data: rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'A leave type with this name already exists' });
    }
    console.error('Add leave type error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const listLeaveTypeController = async (req, res) => {
  try {
    const { rows } = await pool.query(GET_LEAVE_TYPE);
    res.json({
      message: 'Leave type list fetched successfully',
      data: rows,
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.addLeaveType = addLeaveTypeController;
exports.listLeaveType = listLeaveTypeController;
