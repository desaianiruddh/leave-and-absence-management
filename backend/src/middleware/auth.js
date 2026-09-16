const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

exports.requireRole =
  (...roles) =>
  (req, res, next) => {
    console.log('req', req);
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  };
