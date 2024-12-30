const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Financial Summary
const getFinancialSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Calculate total income
    const totalIncome = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
    ]);

    // Calculate total expenses
    const totalExpenses = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
    ]);

    // Get budget details
    const budget = await Budget.findOne({ userId });
    const remainingBudget = budget ? budget.amount - (totalExpenses[0]?.totalExpenses || 0) : 0;


    // Get top categories of expenses
    const topCategories = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalIncome: totalIncome[0]?.totalIncome || 0,
      totalExpenses: totalExpenses[0]?.totalExpenses || 0,
      remainingBudget,
      topCategories: topCategories.map((category) => ({
        category: category._id,
        total: category.total,
      })),
    });
  } catch (error) {
    console.error('Error in getFinancialSummary:', error.message);
    res.status(500).json({ error: 'Failed to generate financial summary', details: error.message });
  }
};

// Monthly Breakdown
const getMonthlyBreakdown = async (req, res) => {
  try {
    // Ensure `userId` is properly converted to an ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Group income and expenses by month
    const monthlyTrends = await Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" }, type: "$type" },
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

    // Filter income and expenses
    const incomeByMonth = monthlyTrends.filter((trend) => trend._id.type === 'income');
    const expensesByMonth = monthlyTrends.filter((trend) => trend._id.type === 'expense');

    // Send the response
    res.status(200).json({
      incomeByMonth,
      expensesByMonth,
    });
  } catch (error) {
    console.error('Error in getMonthlyBreakdown:', error.message);
    res.status(500).json({ error: 'Failed to generate monthly breakdown', details: error.message });
  }
};

// Trend Analysis
const getTrendAnalysis = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.userId);

    // Income trends over time
    const incomeTrends = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $project: { month: { $month: '$date' }, year: { $year: '$date' }, amount: 1 } },
      { $group: { _id: { month: '$month', year: '$year' }, totalIncome: { $sum: '$amount' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    // Expense trends over time
    const expenseTrends = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $project: { month: { $month: '$date' }, year: { $year: '$date' }, amount: 1 } },
      { $group: { _id: { month: '$month', year: '$year' }, totalExpense: { $sum: '$amount' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.status(200).json({
      incomeTrends,
      expenseTrends,
    });
  } catch (error) {
    console.error('Error in getTrendAnalysis:', error.message);
    res.status(500).json({ error: 'Failed to analyze trends', details: error.message });
  }
};

module.exports = {
  getFinancialSummary,
  getMonthlyBreakdown,
  getTrendAnalysis,
};
