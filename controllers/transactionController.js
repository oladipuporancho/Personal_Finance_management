const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, budgetId } = req.body;

    if (!title || !amount || !type || !category || !budgetId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const userId = req.user.userId;

    const budget = await Budget.findOne({ _id: budgetId, userId });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const transaction = new Transaction({
      userId,
      title,
      amount,
      type,
      category,
      budgetId,
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
};

// Get all transactions for a user
const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ userId });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};

// Get a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, amount, type, category, budgetId } = req.body;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.budgetId = budgetId || transaction.budgetId;

    await transaction.save();

    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction', details: error.message });
  }
};

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
