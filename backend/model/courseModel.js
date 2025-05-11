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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Instructors',
      key: 'i_id'
    }
  },
}, {
  timestamps: true,
  tableName: 'Courses'
});

Course.associate = (models) => {
  Course.belongsTo(models.Instructor, {
    foreignKey: 'instructorId',
    as: 'instructor',
    targetKey: 'i_id'
  });
  Course.hasMany(models.Quiz);
  Course.hasMany(models.Material);
};

Course.associate = (models) => {
  Course.belongsToMany(models.StudentId, {
    foreignKey: 'studentId',
    as: 'student',
    targetKey: 's_id'
  });
  Course.belongsToMany(models.Quiz);
  Course.belongsToMany(models.Material);
};

module.exports = Course;