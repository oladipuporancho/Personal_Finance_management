const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
