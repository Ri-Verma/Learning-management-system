const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz, 
  getAllQuizzes,
  submitQuizAnswers,
  getQuizResults,
  getCourceQuizzes
} = require('../controllers/quizControllers');
const { protect, admin, instructor } = require('../middleware/authMiddleware');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Instructor or Admin
router.post('/', protect, instructor, createQuiz);

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private/Admin
router.get('/', protect, admin, getAllQuizzes);

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (enrolled students, instructors, admin)
router.get('/:id', protect, getQuizById);

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Instructor or Admin
router.put('/:id', protect, instructor, updateQuiz);

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteQuiz);

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private (enrolled students only)
router.post('/:id/submit', protect, submitQuizAnswers);

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private (student can see own results, instructors/admin can see all)
router.get('/:id/results', protect, getQuizResults);

// @desc    Get all quizzes for a specific cource
// @route   GET /api/quizzes/cource/:courceId
// @access  Private (enrolled students, instructors, admin)
router.get('/cource/:courceId', protect, getCourceQuizzes);

module.exports = router;