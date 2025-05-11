const express = require('express');
const router = express.Router();
const { 
  getStudentCourses, 
  getInstructorCourses, 
  createCourse,
  enrollInCourse,
  getAllCourses
} = require('../controllers/courseController');

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/instructor/:id', getInstructorCourses);
router.post('/', createCourse);
router.get('/student/:id', getStudentCourses);
router.post('/student/:id/enroll/:courseId', enrollInCourse);
router.get('/all', getAllCourses);


module.exports = router;