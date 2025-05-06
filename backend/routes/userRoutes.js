const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
} = require('../controllers/userControllers');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// Delete user by ID
router.delete('/profile/:id', deleteUser);

// Admin/Teacher routes
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
