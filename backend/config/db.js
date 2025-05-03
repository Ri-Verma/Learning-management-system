// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT || 5432,
  }
);

// Optional: Test connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL via Sequelize'))
  .catch((err) => console.error('Sequelize connection error:', err));

module.exports = sequelize;
