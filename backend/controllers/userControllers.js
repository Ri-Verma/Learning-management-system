const { Student, Instructor } = require('../model/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, userType, department, semester } = req.body;

  try {
    // Validate input
    if (!name || !email || !password || !userType) {
      res.status(400);
      throw new Error('All fields are required');
    }

    // Check if the user already exists
    const userExists =
      (await Student.findOne({ where: { email } })) ||
      (await Instructor.findOne({ where: { email } }));

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    let user;
    if (userType === 'student') {
      // Create a Student
      user = await Student.create({
        name,
        email,
        password: hashedPassword,
        department,
        semester,
      });
    } else if (userType === 'instructor') {
      // Create an Instructor
      user = await Instructor.create({
        name,
        email,
        password: hashedPassword,
        department,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user type');
    }

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        userType,
        department: user.department,
        semester: user.semester || null, // Semester is only for students
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    // Find the user by email
    const user =
      (await Student.findOne({ where: { email } })) ||
      (await Instructor.findOne({ where: { email } }));

    if (user && (await comparePassword(password, user.password))) {
     
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user instanceof Student ? 'student' : 'instructor',
        department: user.department,
        semester: user.semester || null, // Semester is only for students
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user =
      (await Student.findByPk(req.user.id)) ||
      (await Instructor.findByPk(req.user.id));

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user instanceof Student ? 'student' : 'instructor',
        isActive: user.isActive,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user =
      (await Student.findByPk(req.user.id)) ||
      (await Instructor.findByPk(req.user.id));

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department || user.department;

      if (user instanceof Student) {
        user.semester = req.body.semester || user.semester;
      }

      if (req.body.password) {
        user.password = await hashPassword(req.body.password);
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser instanceof Student ? 'student' : 'instructor',
        department: updatedUser.department,
        semester: updatedUser.semester || null,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all users (admin/teacher)
// @route   GET /api/users
// @access  Private/Teacher
const getUsers = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    const instructors = await Instructor.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json([...students, ...instructors]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Teacher or self
const getUserById = async (req, res) => {
  try {
    const user =
      (await Student.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
      })) ||
      (await Instructor.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
      }));

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body; // Accept userId from the request body

    if (!userId) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const user =
      (await Student.findByPk(userId)) ||
      (await Instructor.findByPk(userId));

    if (user) {
      await user.destroy();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
};