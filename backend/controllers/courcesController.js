const asyncHandler = require('express-async-handler');
const Cource = require('../model/courcesModel');
const User = require('../model/userModel');

// @desc    Create a new cource
// @route   POST /api/cources
// @access  Private/Instructor or Admin
const createCource = asyncHandler(async (req, res) => {
  const { title, description, price, category, thumbnail, content } = req.body;

  // Check if all required fields are provided
  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create new cource
  const cource = await Cource.create({
    instructor: req.user._id,
    title,
    description,
    price: price || 0, // Default to free if price not provided
    category,
    thumbnail,
    content: content || [], // Default to empty content array if not provided
  });

  if (cource) {
    res.status(201).json(cource);
  } else {
    res.status(400);
    throw new Error('Invalid cource data');
  }
});

// @desc    Get all cources
// @route   GET /api/cources
// @access  Public
const getAllCources = asyncHandler(async (req, res) => {
  // Query parameters for filtering
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  // Pagination
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Cource.countDocuments({ ...keyword, ...category });
  
  const cources = await Cource.find({ ...keyword, ...category })
    .populate('instructor', 'name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    cources,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get cource by ID
// @route   GET /api/cources/:id
// @access  Public
const getCourceById = asyncHandler(async (req, res) => {
  const cource = await Cource.findById(req.params.id)
    .populate('instructor', 'name email');

  if (cource) {
    res.json(cource);
  } else {
    res.status(404);
    throw new Error('Cource not found');
  }
});

// @desc    Update cource
// @route   PUT /api/cources/:id
// @access  Private/Instructor or Admin
const updateCource = asyncHandler(async (req, res) => {
  const cource = await Cource.findById(req.params.id);

  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  // Check if user is the instructor of the cource or an admin
  if (
    cource.instructor.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to update this cource');
  }

  // Update cource fields
  cource.title = req.body.title || cource.title;
  cource.description = req.body.description || cource.description;
  cource.price = req.body.price !== undefined ? req.body.price : cource.price;
  cource.category = req.body.category || cource.category;
  cource.thumbnail = req.body.thumbnail || cource.thumbnail;
  cource.content = req.body.content || cource.content;
  cource.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : cource.isPublished;

  const updatedCource = await cource.save();
  res.json(updatedCource);
});

// @desc    Delete cource
// @route   DELETE /api/cources/:id
// @access  Private/Admin
const deleteCource = asyncHandler(async (req, res) => {
  const cource = await Cource.findById(req.params.id);

  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  await cource.remove();
  res.json({ message: 'Cource removed' });
});

// @desc    Enroll in a cource
// @route   POST /api/cources/:id/enroll
// @access  Private
const enrollInCource = asyncHandler(async (req, res) => {
  const cource = await Cource.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is already enrolled
  const isEnrolled = user.enrolledCources.includes(cource._id);
  
  if (isEnrolled) {
    res.status(400);
    throw new Error('Already enrolled in this cource');
  }

  // Add cource to user's enrolled cources
  user.enrolledCources.push(cource._id);
  await user.save();

  // Add user to cource's enrolled students
  cource.enrolledStudents.push(user._id);
  await cource.save();

  res.status(201).json({ message: 'Successfully enrolled in cource' });
});

// @desc    Get cource content
// @route   GET /api/cources/:id/content
// @access  Private (enrolled students only)
const getCourceContent = asyncHandler(async (req, res) => {
  const cource = await Cource.findById(req.params.id)
    .populate('instructor', 'name email');

  if (!cource) {
    res.status(404);
    throw new Error('Cource not found');
  }

  // Check if user is enrolled, instructor, or admin
  const isEnrolled = req.user.enrolledCources.includes(cource._id);
  const isInstructor = cource.instructor._id.toString() === req.user._id.toString();
  
  if (!isEnrolled && !isInstructor && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not enrolled in this cource');
  }

  res.json({
    _id: cource._id,
    title: cource.title,
    content: cource.content,
    instructor: cource.instructor,
  });
});

// @desc    Get enrolled cources for current user
// @route   GET /api/cources/enrolled
// @access  Private
const getEnrolledCources = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const enrolledCources = await Cource.find({
    _id: { $in: user.enrolledCources },
  }).populate('instructor', 'name email');

  res.json(enrolledCources);
});

module.exports = {
  createCource,
  getCourceById,
  updateCource,
  deleteCource,
  getAllCources,
  enrollInCource,
  getCourceContent,
  getEnrolledCources,
};