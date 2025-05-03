const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  getUserById, 
  deleteUser 
} = require('../controllers/userControllers');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', registerUser);

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, getAllUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, admin, getUserById);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;