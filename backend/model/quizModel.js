const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define('Quiz', {
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
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 30, // Default to 30 minutes
  },
  passingScore: {
    type: DataTypes.FLOAT,
    defaultValue: 70, // Default to 70%
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Quiz;