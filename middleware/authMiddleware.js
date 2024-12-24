const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
