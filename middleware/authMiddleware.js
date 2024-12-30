const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header('Authorization'); // Get the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token part after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ranchosupersecret10');

    // Attach the decoded user data to the request
    req.user = { userId: decoded.userId };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);

    // Send a response with the appropriate error status and message
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authenticateToken;
