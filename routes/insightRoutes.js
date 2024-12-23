
const express = require('express');
const { getFinancialSummary, getMonthlyBreakdown, getTrendAnalysis } = require('../controllers/insightsController'); // Correct import
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authenticateToken, getFinancialSummary); // Get financial summary
router.get('/monthly', authenticateToken, getMonthlyBreakdown); // Get monthly breakdown
router.get('/trends', authenticateToken, getTrendAnalysis); // Get financial trends (optional)

module.exports = router;
