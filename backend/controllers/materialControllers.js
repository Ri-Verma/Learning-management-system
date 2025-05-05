const path = require('path');
const fs = require('fs');
const Material = require('../model/materialModel'); // Assuming you have a Material model

// @desc    Upload course material
// @route   POST /api/materials
// @access  Private/Instructor
const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const { title, courseId } = req.body;

    const material = await Material.create({
      title,
      courseId,
      filePath: req.file.path,
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all materials for a course
// @route   GET /api/materials/:courseId
// @access  Private
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { courseId: req.params.courseId },
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a material
// @route   DELETE /api/materials/:id
// @access  Private/Instructor
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error('Material not found');
    }

    // Delete the file from the uploads folder
    fs.unlinkSync(material.filePath);

    await material.destroy();
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMaterial, getMaterials, deleteMaterial };