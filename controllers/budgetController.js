const Budget = require('../models/Budget'); // Import the Budget model

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const { title, totalAmount, duration } = req.body;
    const newBudget = new Budget({ title, totalAmount, duration, userId: req.user.userId });
    await newBudget.save();
    res.status(201).json({ message: 'Budget created successfully', budget: newBudget });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
};

// Get all budgets for the authenticated user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets', details: error.message });
  }
};

// Get a specific budget by ID
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the budget', details: error.message });
  }
};

// Update a budget by ID
const updateBudget = async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: 'Budget updated successfully', budget: updatedBudget });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the budget', details: error.message });
  }
};

// Delete a budget by ID
const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the budget', details: error.message });
  }
};

module.exports = { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget };
