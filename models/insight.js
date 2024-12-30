const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  summary: {
    totalIncome: { type: Number, required: true },
    totalExpenses: { type: Number, required: true },
    remainingBudget: { type: Number, required: true },
    topCategories: [
      {
        category: { type: String },
        total: { type: Number },
      },
    ],
  },
  monthlyBreakdown: [
    {
      month: { type: String, required: true },
      income: { type: Number, required: true },
      expense: { type: Number, required: true },
    },
  ],
  trendAnalysis: [
    {
      month: { type: String, required: true },
      income: { type: Number, required: true },
      expense: { type: Number, required: true },
    },
  ],
  weeklyBreakdown: [
    {
      week: { type: String, required: true },
      income: { type: Number, required: true },
      expense: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

const Insight = mongoose.model('Insight', insightSchema);

module.exports = Insight;
