const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); 

// Import models to establish relationships
require('./model/associations');

// Import routes
const userRoutes = require('./routes/userRoutes');
const courcesRoutes = require('./routes/courcesRoutes');
const quizRoutes = require('./routes/quizRoutes');
const materialRoutes = require('./routes/materialRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cources', courcesRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/auth', authRoutes);

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

// Sync Sequelize models and start server
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Sequelize models synced with PostgreSQL');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Sequelize sync error:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing Sequelize connection...');
  await sequelize.close();
  process.exit(0);
});
