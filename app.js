const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const insightRoutes = require('./routes/insightRoutes');

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes setup
app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
