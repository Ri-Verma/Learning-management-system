const Course = require('../model/courseModel');
const Material = require('../model/materialModel');
const Quiz = require('../model/quizModel');
const { Student, Instructor } = require('../model/userModel');

// Middleware function to check if user exists and has correct role
const checkUserRole = async (req, res, next, role) => {
  const userId = req.params.id;
  let user;

  try {
    if (role === 'student') {
      user = await Student.findByPk(userId);
    } else if (role === 'instructor') {
      user = await Instructor.findByPk(userId);
    }

    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware functions for specific roles
const checkStudent = (req, res, next) => checkUserRole(req, res, next, 'student');
const checkInstructor = (req, res, next) => checkUserRole(req, res, next, 'instructor');

// @desc    Get student's enrolled courses with materials and quizzes
// @route   GET /api/courses/student/:id
// @access  Private/Student
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Course,
        include: [
          {
            model: Material,
            attributes: ['id', 'title', 'filePath']
          },
          {
            model: Quiz,
            attributes: ['id', 'title', 'description']
          },
          {
            model: Instructor,
            attributes: ['name'],
            as: 'instructor'
          }
        ]
      }]
    });

    const courses = student.Courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor.name,
      materials: course.Materials,
      quizzes: course.Quizzes
    }));

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor's courses with materials and quizzes
// @route   GET /api/courses/instructor/:id
// @access  Private/Instructor
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.id;
    console.log('Fetching courses for instructor:', instructorId); // Add logging

    const courses = await Course.findAll({
      where: { instructorId }, // This should match with i_id from instructor
      include: [
        {
          model: Material,
          attributes: ['id', 'title', 'filePath']
        },
        {
          model: Quiz,
          attributes: ['id', 'title', 'description']
        }
      ]
    });

    console.log('Found courses:', courses); // Add logging
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error); // Add logging
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
  try {
    const { title, description, category, instructorId } = req.body;
    console.log('Creating course with data:', { title, description, category, instructorId }); // Add logging

    // Validate required fields
    if (!title || !description || !category || !instructorId) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      instructorId // This should match with i_id from instructor
    });

    console.log('Created course:', course); // Add logging
    res.status(201).json(course);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ 
      message: 'Error creating course',
      error: error.message 
    });
  }
};

// @desc    Enroll student in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.params.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await Student.findByPk(studentId);
    await student.addCourse(course);

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStudentCourses,
  getInstructorCourses,
  createCourse,
  enrollInCourse,
  checkStudent,
  checkInstructor
};