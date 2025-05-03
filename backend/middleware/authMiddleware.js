const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');

// Protect routes - verify token and set req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware - verify user is admin
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});

// Instructor middleware - verify user is instructor or admin
const instructor = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.isInstructor || req.user.isAdmin)) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an instructor');
  }
});

// Check if user is enrolled in a course
const isEnrolled = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id || req.params.courseId;
  
  if (!courseId) {
    res.status(400);
    throw new Error('Course ID is required');
  }

  // Check if user is admin or instructor (they have access to all courses)
  if (req.user.isAdmin || req.user.isInstructor) {
    return next();
  }

  // Check if user is enrolled in the course
  const isUserEnrolled = req.user.enrolledCources.includes(courseId);
  
  if (isUserEnrolled) {
    next();
  } else {
    res.status(403);
    throw new Error('Not enrolled in this course');
  }
});

module.exports = { protect, admin, instructor, isEnrolled };