const { Quiz, QuizResult } = require('../model/quizModel');
const User = require('../model/userModel');
const { Student } = require('../model/userModel');
const { Course } = require('../model/courseModel');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    // Check if course exists and user is teacher of the course
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    if (course.teacherId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to create quiz for this course');
    }

    const quiz = await Quiz.create({
      title,
      courseId,
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Public
const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { courseId: req.params.courseId },
      order: [['createdAt', 'DESC']],
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz result
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
const submitQuizResult = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    const { score, answers } = req.body;

    const quizResult = await QuizResult.create({
      quizId: quiz.id,
      studentId: req.user.id,
      score,
      answers,
    });

    res.status(201).json(quizResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get quiz results for a student
// @route   GET /api/quizzes/results
// @access  Private/Student
const getQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'courseId'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quizzes for student
// @route   GET /api/quizzes/student/:id
// @access  Private/Student
const getStudentQuizzes = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Find student's enrolled courses
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Course,
        include: [{
          model: Quiz,
          attributes: ['id', 'title', 'dueDate'],
          include: [{
            model: QuizResult,
            where: { studentId },
            required: false
          }]
        }]
      }]
    });

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    // Format quizzes with status
    const quizzes = student.Courses.flatMap(course => 
      course.Quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        courseId: course.id,
        dueDate: quiz.dueDate,
        status: getQuizStatus(quiz.QuizResults[0], quiz.dueDate)
      }))
    );

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to determine quiz status
const getQuizStatus = (result, dueDate) => {
  if (!result) {
    return new Date(dueDate) < new Date() ? 'missed' : 'pending';
  }
  return 'completed';
};

module.exports = {
  createQuiz,
  getQuizzesByCourse,
  submitQuizResult,
  getQuizResults,
  getStudentQuizzes
};
