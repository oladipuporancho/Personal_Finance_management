const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const { amount, category, narration, budgetId } = req.body;

    if (!amount || !category || !narration) {
      return res.status(400).json({ error: 'All fields except budgetId are required' });
    }

    // Check if the budget exists (if budgetId is provided)
    if (budgetId) {
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
    }

    const transaction = new Transaction({
      userId: req.user.userId, // Assuming auth middleware sets req.user
      amount,
      category,
      narration,
      budgetId: budgetId || null,
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction', details: error.message });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const { date, category, budgetId } = req.query;

    const filters = { userId: req.user.userId }; // Restrict to user's transactions
    if (date) filters.date = date;
    if (category) filters.category = category;
    if (budgetId) filters.budgetId = budgetId;

    const transactions = await Transaction.find(filters).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};

// Get a single transaction
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to view this transaction' });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, narration, budgetId } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this transaction' });
    }

    // Update transaction fields
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (narration) transaction.narration = narration;
    if (budgetId) {
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      transaction.budgetId = budgetId;
    }

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

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
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
