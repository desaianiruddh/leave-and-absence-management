const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Routes will go here
// app.use('/api/leaves', leaveRoutes);
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
