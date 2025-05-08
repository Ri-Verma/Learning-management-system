const Student = require('./userModel').Student;
const Instructor = require('./userModel').Instructor;
const Course = require('./courseModel');
const Quiz = require('./quizModel');
const Comment = require('./commentModel');
const Material = require('./materialModel');

// Define relationships between models

// Instructor and Course (One-to-Many)
Instructor.hasMany(Course, { foreignKey: 'instructorId', onDelete: 'CASCADE' });
Course.belongsTo(Instructor, { foreignKey: 'instructorId' });

// Course and Student (Many-to-Many)
Student.belongsToMany(Course, { 
  through: 'StudentCourses',
  foreignKey: 'studentId',
  otherKey: 'courseId' 
});
Course.belongsToMany(Student, { 
  through: 'StudentCourses',
  foreignKey: 'courseId',
  otherKey: 'studentId' 
});

// Course and Quiz (One-to-Many)
Course.hasMany(Quiz, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Quiz.belongsTo(Course, { foreignKey: 'courseId' });

// Course and Material (One-to-Many)
Course.hasMany(Material, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Material.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
  Student,
  Instructor,
  Course,
  Quiz,
  Comment,
  Material
};