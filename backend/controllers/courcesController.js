const { Course, Enrollment } = require('../model/courseModel');
const User = require('../model/userModel');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

// @desc    Create a new course
// @route   POST /api/cources
// @access  Private/Teacher
const createCourse = async (req, res) => {
  try {
    const { title, description, imageUrl, duration, level, price } = req.body;

    // Create course with current user as teacher
    const course = await Course.create({
      title,
      description,
      imageUrl,
      duration,
      level,
      price,
      teacherId: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/cources
// @access  Public
const getCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${req.query.keyword}%` } },
            { description: { [Op.iLike]: `%${req.query.keyword}%` } },
          ],
        }
      : {};

    const level = req.query.level ? { level: req.query.level } : {};
    
    // Only show published courses unless requesting user is a teacher
    const publishedFilter = req.user && req.user.role === 'teacher' 
      ? {} 
      : { isPublished: true };

    const courses = await Course.findAll({
      where: {
        ...keyword,
        ...level,
        ...publishedFilter,
      },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/cources/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email', 'profilePicture'],
        },
      ],
    });

    if (course) {
      // Check if course is published or user is the teacher
      if (course.isPublished || (req.user && (req.user.id === course.teacherId || req.user.role === 'teacher'))) {
        res.json(course);
      } else {
        res.status(403);
        throw new Error('Course not published');
      }
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/cources/:id
// @access  Private/Teacher
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if user is the teacher who created the course
    if (course.teacherId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this course');
    }

    // Update course details
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.imageUrl = req.body.imageUrl || course.imageUrl;
    course.duration = req.body.duration || course.duration;
    course.level = req.body.level || course.level;
    course.price = req.body.price || course.price;
    course.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : course.isPublished;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/cources/:id
// @access  Private/Teacher
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if user is the teacher who created the course
    if (course.teacherId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this course');
    }

    await course.destroy();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/cources/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (!course.isPublished) {
      res.status(400);
      throw new Error('Course is not published yet');
    }

    // Check if course capacity is full
    const enrollmentCount = await Enrollment.count({
      where: { courseId: course.id },
    });

    if (enrollmentCount >= course.capacity) {
      res.status(400);
      throw new Error('Course capacity is full');
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentId: req.user.id,
        courseId: course.id,
      },
      transaction: t,
    });

    if (existingEnrollment) {
      await t.rollback();
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await Enrollment.create(
      {
        studentId: req.user.id,
        courseId: course.id,
        status: 'active',
        enrollmentDate: new Date(),
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get enrolled courses for current user
// @route   GET /api/cources/enrolled
// @access  Private
const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        studentId: req.user.id,
      },
      include: [
        {
          model: Course,
          as: 'Course',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['id', 'name', 'email', 'profilePicture'],
            },
          ],
        },
      ],
    });

    const courses = enrollments.map((enrollment) => {
      return {
        ...enrollment.Course.dataValues,
        progress: enrollment.progress,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        completionDate: enrollment.completionDate,
      };
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses created by teacher
// @route   GET /api/cources/teacher
// @access  Private/Teacher
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: {
        teacherId: req.user.id,
      },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students enrolled in a course
// @route   GET /api/cources/:id/students
// @access  Private/Teacher
const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if user is the teacher who created the course
    if (course.teacherId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to view this information');
    }

    const enrollments = await Enrollment.findAll({
      where: {
        courseId: course.id,
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email', 'profilePicture'],
        },
      ],
    });

    const students = enrollments.map((enrollment) => {
      return {
        ...enrollment.User.dataValues,
        progress: enrollment.progress,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
      };
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enrollment status
// @route   PUT /api/cources/:id/enrollment
// @access  Private/Student
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;
    
    const enrollment = await Enrollment.findOne({
      where: {
        courseId: req.params.id,
        studentId: req.user.id,
      },
    });

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    // Update enrollment
    if (status) enrollment.status = status;
    if (progress) enrollment.progress = progress;
    
    // If status is completed, set completion date
    if (status === 'completed') {
      enrollment.completionDate = new Date();
    }

    const updatedEnrollment = await enrollment.save();
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
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
};
