const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  resume: { type: String, required: true }, 
//   declaration: { type: Boolean, required: true }, 
  dateOfjoining: { type: Date, required: false },
  department: { type: String, required: false },
//   status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
status: { type: String, enum: ['new','scheduled','ongoing', 'selected', 'rejected'], default: 'new' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);