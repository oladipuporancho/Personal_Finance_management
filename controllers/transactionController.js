const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Helper function to find a transaction
const findTransaction = async (id, userId) => {
  return Transaction.findOne({ _id: id, userId });
};

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { narration, amount, type, category, budgetId, time } = req.body;

    // Validate required fields
    if (!narration || !amount || !category) {
      return res.status(400).json({ error: 'Narration, amount, and category are required.' });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    if (type && !['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type. Must be "expense" or "income".' });
    }

    if (time && isNaN(Date.parse(time))) {
      return res.status(400).json({ error: 'Invalid time format. Must be a valid date.' });
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
      type: type || 'expense',
      category,
      budgetId: budgetId || null,
      time: time || new Date(),
    });

    await transaction.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Error in addTransaction:', error.stack);
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
};

// Get all transactions for a user
const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transactions = await Transaction.find({ userId });
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error in getAllTransactions:', error.stack);
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};

// Get a transaction by its ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transaction = await findTransaction(id, userId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error('Error in getTransactionById:', error.stack);
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { narration, amount, type, category, budgetId, time } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transaction = await findTransaction(id, userId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (type && !['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type. Must be "expense" or "income".' });
    }

    if (budgetId) {
      const budget = await Budget.findOne({ _id: budgetId, userId });
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found or does not belong to the user.' });
      }
    }

    if (narration !== undefined) transaction.narration = narration;
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (budgetId !== undefined) transaction.budgetId = budgetId;
    if (time !== undefined) transaction.time = time;

    await transaction.save();

    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Error in updateTransaction:', error.stack);
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
    }

    const transaction = await findTransaction(id, userId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error.stack);
    res.status(500).json({ error: 'Failed to delete transaction', details: error.message });
  }
};

module.exports = {
  addTransaction,
  getAllTransactions,  // Added this function here
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
