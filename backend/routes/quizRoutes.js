const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizzesByCourse, 
  submitQuizResult, 
  getQuizResults 
} = require('../controllers/quizControllers');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Instructor
router.post('/', createQuiz);

// @desc    Get all quizzes for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
router.get('/course/:courseId', getQuizzesByCourse);

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', submitQuizResult);

// @desc    Get quiz results
// @route   GET /api/quizzes/results
// @access  Private
router.get('/results', getQuizResults);

module.exports = router;