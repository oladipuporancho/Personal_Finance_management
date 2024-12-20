const express = require('express');
const { generateSummary, getMonthlyBreakdown, getTrends } = require('../controllers/insightController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Financial insights routes
router.get('/api/insights/summary', authenticateToken, generateSummary); // Get financial summary
router.get('/api/insights/monthly', authenticateToken, getMonthlyBreakdown); // Get monthly breakdown
router.get('/api/insights/trends', authenticateToken, getTrends); // Get financial trends (optional)

module.exports = router;
