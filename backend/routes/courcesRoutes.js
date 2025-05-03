const express = require('express');
const router = express.Router();
const { 
  createCource, 
  getCourceById, 
  updateCource, 
  deleteCource, 
  getAllCources,
  enrollInCource,
  getCourceContent,
  getEnrolledCources
} = require('../controllers/courcesController');
const { protect, admin, instructor } = require('../middleware/authMiddleware');

// @desc    Create a new cource
// @route   POST /api/cources
// @access  Private/Instructor or Admin
router.post('/', protect, instructor, createCource);

// @desc    Get all cources
// @route   GET /api/cources
// @access  Public
router.get('/', getAllCources);

// @desc    Get cource by ID
// @route   GET /api/cources/:id
// @access  Public
router.get('/:id', getCourceById);

// @desc    Update cource
// @route   PUT /api/cources/:id
// @access  Private/Instructor or Admin
router.put('/:id', protect, instructor, updateCource);

// @desc    Delete cource
// @route   DELETE /api/cources/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteCource);

// @desc    Enroll in a cource
// @route   POST /api/cources/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, enrollInCource);

// @desc    Get cource content
// @route   GET /api/cources/:id/content
// @access  Private (enrolled students only)
router.get('/:id/content', protect, getCourceContent);

// @desc    Get enrolled cources for current user
// @route   GET /api/cources/enrolled
// @access  Private
router.get('/enrolled/me', protect, getEnrolledCources);

module.exports = router;