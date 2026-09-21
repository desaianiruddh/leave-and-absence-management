const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { LOGIN_QUERY, GET_USERS_LIST } = require('../services/userQuery');

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await pool.query(LOGIN_QUERY, [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        managerId: user.manager_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        role: user.role,
        managerId: user.manager_id,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const listUsersController = async (req, res) => {
  try {
    const { rows } = await pool.query(GET_USERS_LIST);
    res.json({
      message: 'User listed fetched successfully',
      data: rows,
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.login = loginController;
exports.usersList = listUsersController;
