const express = require('express');
const { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget } = require('../controllers/budgetController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, createBudget); // Create a new budget
router.get('/', authenticateToken, getBudgets); // Get all budgets
router.get('/:id', authenticateToken, getBudgetById); // Get a specific budget by ID
router.put('/:id', authenticateToken, updateBudget); // Update a budget
router.delete('/:id', authenticateToken, deleteBudget); // Delete a budget


module.exports = router;
