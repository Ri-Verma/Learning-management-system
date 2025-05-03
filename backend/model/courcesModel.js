const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Course;