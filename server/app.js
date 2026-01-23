const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes (will be added here)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/donor', require('./routes/donor'));
// app.use('/api/ngo', require('./routes/ngo'));
// app.use('/api/campaign', require('./routes/campaign'));
// app.use('/api/donation', require('./routes/donation'));
// app.use('/api/admin', require('./routes/admin'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Shohay Donation System API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
