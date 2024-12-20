const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes'); // Import your budget routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes with '/api' prefix
app.use('/api', authRoutes); // All auth routes will now be prefixed with /api
app.use('/api/transactions', transactionRoutes); // All transaction routes will now be prefixed with /api/transactions
app.use('/api/budgets', budgetRoutes); // All budget routes will now be prefixed with /api/budgets

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
