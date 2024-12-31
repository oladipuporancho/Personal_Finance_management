const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Financial Summary
const getFinancialSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Debug: Log the user ID
    console.log('User ID:', userId);

    // Fetch income transactions
    const incomeTransactions = await Transaction.find({ userId, type: 'income' });
    console.log('Income Transactions:', incomeTransactions);

    // Calculate total income
    const totalIncome = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
    ]);

    // Debug: Log total income
    console.log('Total Income (Aggregation):', totalIncome);

    // Calculate total expenses
    const totalExpenses = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
    ]);

    // Debug: Log total expenses
    console.log('Total Expenses:', totalExpenses);

    // Fetch budget
    const budget = await Budget.findOne({ userId });
    console.log('Budget Document:', budget);

    // Calculate remaining budget
    const remainingBudget = budget && budget.amount != null
      ? budget.amount - (totalExpenses[0]?.totalExpenses || 0)
      : 0;

    // Debug: Log remaining budget
    console.log('Remaining Budget:', remainingBudget);

    // Get top categories of expenses
    const topCategories = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Debug: Log top categories
    console.log('Top Categories:', topCategories);

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
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const monthlyTrends = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const incomeByMonth = monthlyTrends.filter((trend) => trend._id.type === 'income');
    const expensesByMonth = monthlyTrends.filter((trend) => trend._id.type === 'expense');

    res.status(200).json({
      incomeByMonth,
      expensesByMonth,
    });
  } catch (error) {
    console.error('Error in getMonthlyBreakdown:', error.message);
    res.status(500).json({ error: 'Failed to generate monthly breakdown', details: error.message });
  }
};

// Weekly Breakdown
const getWeeklyBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const weeklyTrends = await Transaction.aggregate([
      { $match: { userId } },
      {
        $project: {
          week: { $isoWeek: "$date" },  // Get ISO week number
          year: { $year: "$date" },
          type: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: { week: "$week", year: "$year", type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }, // Sort by year and week number
    ]);

    const incomeByWeek = weeklyTrends.filter((trend) => trend._id.type === 'income');
    const expensesByWeek = weeklyTrends.filter((trend) => trend._id.type === 'expense');

    res.status(200).json({
      incomeByWeek,
      expensesByWeek,
    });
  } catch (error) {
    console.error('Error in getWeeklyBreakdown:', error.message);
    res.status(500).json({ error: 'Failed to generate weekly breakdown', details: error.message });
  }
};

// Trend Analysis
const getTrendAnalysis = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.userId);

    const incomeTrends = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $project: { month: { $month: '$date' }, year: { $year: '$date' }, amount: 1 } },
      { $group: { _id: { month: '$month', year: '$year' }, totalIncome: { $sum: '$amount' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

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
  getWeeklyBreakdown, // Exporting the new function
};
