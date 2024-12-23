const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    newUser.password = undefined;
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
};

// Function to handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Function to handle user profile update
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming authenticateToken middleware sets req.user
    const { username, email } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update only the fields that are provided
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    user.password = undefined; // Exclude password from the response

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
};

// Function to handle password update
const updatePassword = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming authenticateToken middleware sets req.user
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
};

module.exports = { register, login, updateProfile, updatePassword };
