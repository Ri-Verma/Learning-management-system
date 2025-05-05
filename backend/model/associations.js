const Student = require('./userModel').Student;
const Instructor = require('./userModel').Instructor;
const Course = require('./courseModel');
const Quiz = require('./quizModel');
const Comment = require('./commentModel');

// Define relationships between models

// Instructor and Course
Instructor.hasMany(Course, { foreignKey: 'instructorId', onDelete: 'CASCADE' });
Course.belongsTo(Instructor, { foreignKey: 'instructorId', onDelete: 'CASCADE' });

// Course and Quiz
Course.hasMany(Quiz, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });

// Student and Comment
Student.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Instructor and Comment
Instructor.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(Instructor, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Course and Comment
Course.hasMany(Comment, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Comment.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });

module.exports = { Student, Instructor, Course, Quiz, Comment };