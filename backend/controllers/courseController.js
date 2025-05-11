const Course = require('../model/courseModel');
const Material = require('../model/materialModel');
const Quiz = require('../model/quizModel');
const { Student, Instructor } = require('../model/userModel');

//check if user exists and has correct role
const checkUserRole = async (req, res, next, role) => {
  const userId = req.params.id;
  
  try {
    let user;
    if (role === 'student') {
      user = await Student.findByPk(userId);
    } else if (role === 'instructor') {
      user = await Instructor.findByPk(userId);
    }

    if (!user) {
      return res.status(404).json({ 
        message: `${role} not found` 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error checking ${role} role:`, error);
    res.status(500).json({ message: error.message });
  }
};

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

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student.Courses);
  } catch (error) {
    console.error('Error in getStudentCourses:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor's courses with materials and quizzes
// @route   GET /api/courses/instructor/:id
// @access  Private/Instructor
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.id;
    console.log('Fetching courses for instructor:', instructorId);

    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    const courses = await Course.findAll({
      where: { 
        instructorId: instructorId 
      },
      include: [
        {
          model: Quiz,
          attributes: ['id', 'title', 'description'],
          required: false
        },
        {
          model: Material,
          attributes: ['id', 'title', 'filePath'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Found courses:', courses.length);
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error in getInstructorCourses:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
  try {
    const { title, description, category, instructorId } = req.body;

    // Validate instructor exists
    const instructor = await Instructor.findByPk(instructorId);
    if (!instructor) {
      return res.status(404).json({ 
        message: 'Instructor not found' 
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      instructorId
    });

    console.log('Created course:', course.id);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
};


// @ get all cources

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Instructor,
        attributes: ['name'],
        as: 'instructor'
      }
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};


// @desc    Enroll student in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  try {
    const { courseId, id: studentId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const student = await Student.findByPk(studentId);
    const isEnrolled = await student.hasCourse(course);
    if (isEnrolled) return res.status(400).json({ message: 'Already enrolled in this course' });

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
  checkInstructor,
  getAllCourses
};