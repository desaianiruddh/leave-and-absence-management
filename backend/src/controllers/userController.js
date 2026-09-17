const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
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
  const query = `
  select
    u1.id,
    u1.email,
    u1.first_name || ' ' || u1.last_name as name,
    u1.role,
    u1.department,
    u2.first_name || ' ' || u2.last_name as manager
  from
    users u1
    left join users u2 on u1.manager_id = u2.id
  order by
    u1.id`;
  try {
    const { rows } = await pool.query(query);
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
