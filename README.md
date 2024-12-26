# finance_management
# Personal Finance Manager API

/*The Personal Finance Manager API is a backend service for managing user profiles, budgets, transactions, and financial insights. It provides a RESTful API for authentication, creating transactions, managing budgets, and retrieving financial data.

Features
- User registration and authentication (JWT-based).
- Create, read, update, and delete financial transactions.
- Budget management.
- Retrieve user financial summaries.

Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose for ODM)
- Authentication: JSON Web Token (JWT)
- Other Libraries:
  - bcrypt (for password hashing)
  - cors (for cross-origin resource sharing)
  - dotenv (for environment variables management)

Project Structure
Personal Finance Manager API
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   ├── budgetController.js
│   ├── insightsController.js
│   ├── transactionController.js
├── middleware
│   └── authMiddleware.js
├── models
│   ├── Budget.js
│   ├── insight.js
│   ├── Transaction.js
│   └── User.js
├── routes
│   ├── authRoutes.js
│   ├── budgetRoutes.js
│   ├── insightRoutes.js
│   └── transactionRoutes.js
├── utils
│   └── passwordUtils.js
├── .env
├── app.js
├── package.json
├── package-lock.json
└── README.md


Getting Started

Prerequisites
1. Install Node.js (v16.6).
2. Install MongoDB and ensure it is running.
3. Setting up a environment variables in a .env file.

Environment Variables

env
DB_URI=mongodb+srv://oladipuporancho10:rThTalYFz0KEoLck@cluster0.cw5d7.mongodb.net/personal_finance_manager?retryWrites=true&w=majority
JWT_SECRET=ranchosupersecret10
PORT=5000

Installation

1. Clone the repository:
   bash
   git clone https://github.com/oladipuporancho/Personal_Finance_management.git
   cd personal-finance-manager

2. Install dependencies:
  bash
   npm install

3. Start the server:
   bash
   npm run dev

4. Access the API at:
   http://localhost:5000


API Endpoints

1 Authentication

1.1 Register a User
POST /api/register
Request Body:
json
{
  "username": "Rancho",
  "email": "ra@gmail.com",
  "password": "password123"
}
Response:
json
{
  "message": "User created successfully",
  "user": {
    "_id": "64a4567b45f67678901234",
    "username": "Rancho",
    "email": "ra@gmail.com"
  }
}


1.2 Login a User
POST /api/login

Request Body:
json
{
  "email": "ra@gmail.com",
  "password": "password123"
}

Response:
json
{
  "message": "Login successful",
  "token": "<jwt_token>"
}


2. User Profile
2.1 Get User Profile
GET/api/profile`

Headers:
json
{
  "Authorization": "Bearer <jwt_token>"
}


Response:
json
{
  "user": {
    "_id": "64a4567b45f67678901234",
    "username": "Rancho",
    "email": "example@gmail.com"
  }
}


3. Transactions
3.1 Create a Transaction
POST /api/transactions

Headers:*
json
{
  "Authorization": "Bearer <jwt_token>"
}


Request Body:
json
{
  "title": "Salary",
  "amount": 5000,
  "type": "income",
  "category": "Job"
}


Response:
json
{
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "64a4567b45f67678905678",
    "title": "Salary",
    "amount": 5000,
    "type": "income",
    "category": "Job",
    "date": "2024-12-20T12:34:56.789Z"
  }
}

3.2 Get All Transactions
GET /api/transactions
Headers:
json
{
  "Authorization": "Bearer <jwt_token>"
}

Response:
json
{
  "transactions": [
    {
      "_id": "64a4567b45f67678905678",
      "title": "Salary",
      "amount": 5000,
      "type": "income",
      "category": "Job",
      "date": "2024-12-20T12:34:56.789Z"
    }
  ]
}

3.3 Update a Transaction
PUT /api/transactions/:id
Headers:
json
{
  "Authorization": "Bearer <jwt_token>"
}

Request Body:
json
{
  "title": "Freelance",
  "amount": 1000,
  "type": "income",
  "category": "Project"
}
Response:
json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "64a4567b45f67678905678",
    "title": "Freelance",
    "amount": 1000,
    "type": "income",
    "category": "Project",
    "date": "2024-12-20T12:34:56.789Z"
  }
}

3.4 Delete a Transaction
DELETE/api/transactions/:id

Headers:
json
{
  "Authorization": "Bearer <jwt_token>"
}

Response:
json
{
  "message": "Transaction deleted successfully"
}


*/
