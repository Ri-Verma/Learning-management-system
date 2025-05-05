const express = require('express');
const router = express.Router();
const {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
} = require('../controllers/materialControllers');
const upload = require('../config/uploads');

// @route   POST /api/materials
// @desc    Upload course material
// @access  Private/Instructor
router.post('/', upload.single('file'), uploadMaterial);

// @route   GET /api/materials/:courseId
// @desc    Get all materials for a course
// @access  Private (students and instructors)
router.get('/:courseId', getMaterials);

// @route   DELETE /api/materials/:id
// @desc    Delete a material
// @access  Private/Instructor
router.delete('/:id', deleteMaterial);

module.exports = router;