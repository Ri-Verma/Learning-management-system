const express = require('express');
const { registerUser, loginUser } = require('../controllers/userControllers');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', loginUser);

module.exports = router;