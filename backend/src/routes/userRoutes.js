const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/login', userController.login);
router.post(
  '/list',
  authenticateToken,
  requireRole('admin'),
  userController.usersList,
);

module.exports = router;
