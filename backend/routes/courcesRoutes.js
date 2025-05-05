const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getTeacherCourses,
  getCourseStudents,
  updateEnrollmentStatus,
} = require('../controllers/courcesController');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Teacher routes
router.post('/', createCourse); // Create a course
router.put('/:id', updateCourse); // Update a course
router.delete('/:id', deleteCourse); // Delete a course
router.get('/teacher', getTeacherCourses); // Get courses created by a teacher
router.get('/:id/students', getCourseStudents); // Get students enrolled in a course

// Student routes
router.post('/:id/enroll', enrollCourse); // Enroll in a course
router.get('/enrolled', getEnrolledCourses); // Get courses a student is enrolled in
router.put('/:id/enrollment', updateEnrollmentStatus); // Update enrollment status

module.exports = router;
