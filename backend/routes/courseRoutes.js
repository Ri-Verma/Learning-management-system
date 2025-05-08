const express = require('express');
const router = express.Router();
const { 
  getStudentCourses, 
  getInstructorCourses, 
  createCourse,
  enrollInCourse,
  checkStudent,
  checkInstructor
} = require('../controllers/courseController');

// Student routes
router.get('/student/:id', checkStudent, getStudentCourses);
router.post('/student/:id/enroll/:courseId', checkStudent, enrollInCourse);

// Instructor routes
router.get('/instructor/:id', checkInstructor, getInstructorCourses);
// Changed from /create to / for course creation
router.post('/', createCourse);

module.exports = router;