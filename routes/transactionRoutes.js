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

router.post('/', authenticateToken, addTransaction);
router.get('/', authenticateToken, getAllTransactions);
router.get('/:id', authenticateToken, getTransactionById);
router.put('/:id', authenticateToken, updateTransaction);
router.delete('/:id', authenticateToken, deleteTransaction); 

module.exports = router;
