const express = require('express');
const {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a new transaction
router.post('/', authenticateToken, addTransaction);

// Route to get all transactions
router.get('/', authenticateToken, getAllTransactions);

// Route to get a transaction by its ID
router.get('/:id', authenticateToken, getTransactionById);

// Route to update a transaction by its ID
router.put('/:id', authenticateToken, updateTransaction);

// Route to delete a transaction by its ID
router.delete('/:id', authenticateToken, deleteTransaction);

module.exports = router;
