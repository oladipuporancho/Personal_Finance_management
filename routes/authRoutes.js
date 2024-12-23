const express = require('express');
const { register, login, updateProfile, updatePassword } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Register user
router.post('/login', login); // Login user

router.put('/profile', authenticateToken, updateProfile);
router.put('/profile/password', authenticateToken, updatePassword);

module.exports = router;
