const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', (req, res) => {
  register(req, res); // Simple route, pass to controller
});

router.post('/login', (req, res) => {
  login(req, res); // Simple route, pass to controller
});

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ msg: 'Access granted', user: req.user });
});

module.exports = router;