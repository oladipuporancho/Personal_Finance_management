const express = require('express');
const { getFinancialSummary, getMonthlyBreakdown, getTrendAnalysis, getWeeklyBreakdown } = require('../controllers/insightsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authenticateToken, getFinancialSummary);  // Get financial summary
router.get('/monthly', authenticateToken, getMonthlyBreakdown);  // Get monthly breakdown
router.get('/weekly', authenticateToken, getWeeklyBreakdown);    // Get weekly breakdown
router.get('/trends', authenticateToken, getTrendAnalysis);      // Get financial trends 

module.exports = router;
