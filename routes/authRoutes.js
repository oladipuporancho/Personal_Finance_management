const express = require('express');
const {
  register,
  login,
  updateProfile,
  updatePassword,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/profile', authenticateToken, updateProfile);
router.put('/profile/password', authenticateToken, updatePassword);

module.exports = router;
