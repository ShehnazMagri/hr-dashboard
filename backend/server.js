const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs'); // Import fs module

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'token'], // Allowed headers
}));


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', candidateRoutes);

// Serve static files (for resume downloads)
app.use('/resumes', express.static('public/resumes'));

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/authDB') // Updated connection syntax
  .then(() => {
    console.log('Database connected successfully');
    // Ensure resumes directory exists
    const resumesDir = './public/resumes';
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;