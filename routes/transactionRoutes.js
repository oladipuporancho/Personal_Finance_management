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
router.post('/transactions', authenticateToken, addTransaction);

// Route to get all transactions
router.get('/transactions', authenticateToken, getAllTransactions);

// Route to get a transaction by its ID
router.get('/transactions/:id', authenticateToken, getTransactionById);

// Route to update a transaction by its ID
router.put('/transactions/:id', authenticateToken, updateTransaction);

// Route to delete a transaction by its ID
router.delete('/transactions/:id', authenticateToken, deleteTransaction);

module.exports = router;
