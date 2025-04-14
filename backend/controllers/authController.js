const User = require('../models/Users'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


exports.register = async (req, res) => {
  console.log('Request body:', req.body); 
  const { fullName, email, password, confirmPassword } = req.body || {};

  // Validation checks
  if (!fullName || fullName.trim() === '') {
    return res.status(400).json({ msg: 'Full name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Please include a valid email' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ msg: 'Password must be 8+ characters' });
  }

  if (!confirmPassword || confirmPassword.trim() === '') {
    return res.status(400).json({ msg: 'Confirm password is required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already registered' });
    }

    // Create new user
    const user = new User({ fullName, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation error', errors: err.errors });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ msg: 'User already registered' });
    } else {
      console.error('Server error:', err.message);
      return res.status(500).json({ msg: 'Server error', error: err.message });
    }
  }
};

exports.login = async (req, res) => {
  console.log('Request body:', req.body); 
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please include a valid email' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    user.token = token; // Update token on login
    await user.save();

    res.json({ msg: 'Successfully logged in', token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};