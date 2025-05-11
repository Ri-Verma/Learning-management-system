const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./courseModel');


// Define the Student model
const Student = sequelize.define('Student', {
  s_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Define the Instructor model
const Instructor = sequelize.define('Instructor', {
  i_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Instructor.hasMany(Course, {
  foreignKey: 'instructorId',
  sourceKey: 'i_id'
});
Course.belongsTo(Instructor, {
  foreignKey: 'instructorId',
  targetKey: 'i_id',
  as: 'instructor' // Optional alias
});

Student.belongsToMany(Course, {
  through: 'StudentCourses',
  foreignKey: 'studentId',
  otherKey: 'courseId',
});
Course.belongsToMany(Student, {
  through: 'StudentCourses',
  foreignKey: 'courseId',
  otherKey: 'studentId',
});


module.exports = { Student, Instructor };