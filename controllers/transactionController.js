const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { narration, amount, type, category, budgetId, time } = req.body;

    // Validate required fields
    if (!narration || !amount || !category) {
      return res.status(400).json({ error: 'Narration, amount, and category are required' });
    }

    const userId = req.user?.userId;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    // Validate transaction type if provided
    if (type && !['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type. Must be "expense" or "income".' });
    }

    // Verify the budget exists if budgetId is provided
    if (budgetId) {
      const budget = await Budget.findOne({ _id: budgetId, userId });
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found or does not belong to the user.' });
      }
    }

    // Create the transaction
    const transaction = new Transaction({
      userId,
      narration,
      amount,
      type: type || 'expense', // Default to 'expense' if not provided
      category,
      budgetId: budgetId || null, // Default to null if not provided
      time: time || new Date(), // Default to current time if not provided
    });

    await transaction.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Error in addTransaction:', error);
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
};

// Get all transactions for a user
const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transactions = await Transaction.find({ userId });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};

// Get a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { narration, amount, type, category, budgetId, time } = req.body;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    // Find the transaction and validate its existence
    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Validate transaction type if provided
    if (type && !['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type. Must be "expense" or "income".' });
    }

    // Verify the budget exists if budgetId is updated
    if (budgetId) {
      const budget = await Budget.findOne({ _id: budgetId, userId });
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found or does not belong to the user.' });
      }
    }

    // Update only the fields provided in the request
    transaction.narration = narration || transaction.narration;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.budgetId = budgetId || transaction.budgetId;
    transaction.time = time || transaction.time;

    await transaction.save();

    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    // Find the transaction and validate its existence
    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.deleteOne();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
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
