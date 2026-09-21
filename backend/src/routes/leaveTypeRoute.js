const express = require('express');
const leaveTypeController = require('../controllers/leaveTypeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/add',
  authenticateToken,
  requireRole('admin'),
  leaveTypeController.addLeaveType,
);
router.get(
  '/list',
  authenticateToken,
  requireRole('admin'),
  leaveTypeController.listLeaveType,
);

module.exports = router;
