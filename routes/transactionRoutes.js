const express = require('express');
const {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');  // Ensure correct import path
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Transaction routes
router.post('/', authenticateToken, addTransaction); // Add a new transaction
router.get('/', authenticateToken, getAllTransactions); // Get all transactions
router.get('/:id', authenticateToken, getTransactionById); // Get a specific transaction by ID
router.put('/:id', authenticateToken, updateTransaction); // Update a transaction
router.delete('/:id', authenticateToken, deleteTransaction); // Delete a transaction

module.exports = router;
