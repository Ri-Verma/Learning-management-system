const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Import routes
const userRoutes = require('./routes/userRoutes');
const courcesRoutes = require('./routes/courcesRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cources', courcesRoutes);
app.use('/api/quizzes', quizRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PG_USER, // PostgreSQL user from .env
  host: process.env.PG_HOST, // PostgreSQL host from .env
  database: process.env.PG_DATABASE, // PostgreSQL database name from .env
  password: process.env.PG_PASSWORD, // PostgreSQL password from .env
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port
});

// Test PostgreSQL connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((error) => {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing PostgreSQL connection...');
  await pool.end();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});