const express = require('express');
const { register, login, updateProfile, updatePassword } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// User registration and login routes
router.post('/register', register); // Register user
router.post('/login', login); // Login user

// User profile update and password update routes
router.put('/profile', authenticateToken, updateProfile); // Update user profile
router.put('/profile/password', authenticateToken, updatePassword); // Update password

module.exports = router;
