const asyncHandler = require('express-async-handler');
const Quiz = require('../model/quizModel');
const User = require('../model/userModel');
const Cource = require('../model/courcesModel');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Instructor or Admin
const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, courceId, questions, timeLimit, passingScore } = req.body;

  // Check if all required fields are provided
  if (!title || !courceId || !questions || questions.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if course exists
  const cource = await Cource.findById(courceId);
  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  // Check if user is the instructor of the course or an admin
  if (
    cource.instructor.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to create quiz for this cource');
  }

  // Create new quiz
  const quiz = await Quiz.create({
    title,
    description,
    cource: courceId,
    questions,
    timeLimit: timeLimit || 30, // Default to 30 minutes if not provided
    passingScore: passingScore || 70, // Default to 70% if not provided
    createdBy: req.user._id,
  });

  if (quiz) {
    res.status(201).json(quiz);
  } else {
    res.status(400);
    throw new Error('Invalid quiz data');
  }
});

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private/Admin
const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({})
    .populate('cource', 'title')
    .populate('createdBy', 'name email');
  
  res.json(quizzes);
});

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (enrolled students, instructors, admin)
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate('cource', 'title')
    .populate('createdBy', 'name email');

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // Check if user is enrolled in the course, is the instructor, or is an admin
  const cource = await Cource.findById(quiz.cource);
  
  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  const isEnrolled = req.user.enrolledCources.includes(cource._id);
  const isInstructor = cource.instructor.toString() === req.user._id.toString();
  
  if (!isEnrolled && !isInstructor && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access this quiz');
  }

  // For students, don't return correct answers
  if (!isInstructor && !req.user.isAdmin) {
    const quizWithoutAnswers = {
      ...quiz._doc,
      questions: quiz.questions.map(q => ({
        ...q,
        correctAnswer: undefined
      }))
    };
    return res.json(quizWithoutAnswers);
  }

  res.json(quiz);
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Instructor or Admin
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // Check if user is the creator of the quiz or an admin
  if (
    quiz.createdBy.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to update this quiz');
  }

  // Update quiz fields
  quiz.title = req.body.title || quiz.title;
  quiz.description = req.body.description || quiz.description;
  quiz.questions = req.body.questions || quiz.questions;
  quiz.timeLimit = req.body.timeLimit || quiz.timeLimit;
  quiz.passingScore = req.body.passingScore || quiz.passingScore;
  quiz.isActive = req.body.isActive !== undefined ? req.body.isActive : quiz.isActive;

  const updatedQuiz = await quiz.save();
  res.json(updatedQuiz);
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  await quiz.remove();
  res.json({ message: 'Quiz removed' });
});

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private (enrolled students only)
const submitQuizAnswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error('Please provide answers');
  }

  const quiz = await Quiz.findById(req.params.id);
  
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // Check if user is enrolled in the course
  const cource = await Cource.findById(quiz.cource);
  
  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  const isEnrolled = req.user.enrolledCources.includes(cource._id);
  
  if (!isEnrolled && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not enrolled in this cource');
  }

  // Check if user has already submitted this quiz
  const existingSubmission = await QuizSubmission.findOne({
    quiz: quiz._id,
    user: req.user._id,
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('You have already submitted this quiz');
  }

  // Calculate score
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;

  answers.forEach(answer => {
    const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / totalQuestions) * 100;
  const passed = score >= quiz.passingScore;

  // Create submission record
  const submission = await QuizSubmission.create({
    quiz: quiz._id,
    user: req.user._id,
    answers,
    score,
    passed,
    submittedAt: Date.now(),
  });

  res.status(201).json({
    score,
    passed,
    totalQuestions,
    correctAnswers,
    submissionId: submission._id,
  });
});

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private (student can see own results, instructors/admin can see all)
const getQuizResults = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // For instructors and admins, return all submissions
  if (req.user.isInstructor || req.user.isAdmin) {
    const submissions = await QuizSubmission.find({ quiz: quiz._id })
      .populate('user', 'name email');
    
    return res.json(submissions);
  }

  // For students, return only their own submissions
  const submissions = await QuizSubmission.find({
    quiz: quiz._id,
    user: req.user._id,
  });

  res.json(submissions);
});

// @desc    Get all quizzes for a specific cource
// @route   GET /api/quizzes/cource/:courceId
// @access  Private (enrolled students, instructors, admin)
const getCourceQuizzes = asyncHandler(async (req, res) => {
  const courceId = req.params.courceId;
  
  // Check if course exists
  const cource = await Cource.findById(courceId);
  
  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  // Check if user is enrolled in the course, is the instructor, or is an admin
  const isEnrolled = req.user.enrolledCources.includes(cource._id);
  const isInstructor = cource.instructor.toString() === req.user._id.toString();
  
  if (!isEnrolled && !isInstructor && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access quizzes for this cource');
  }

  const quizzes = await Quiz.find({ cource: courceId })
    .select('-questions.correctAnswer') // Don't return correct answers to students
    .populate('createdBy', 'name');
  
  res.json(quizzes);
});

module.exports = {
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllQuizzes,
  submitQuizAnswers,
  getQuizResults,
  getCourceQuizzes,
};