// 📁 models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic account info
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed
  full_name: { type: String, required: true },
  phone: { type: String, required: true },

  // Role & profile
  user_type: { type: String, enum: ['borrower', 'lender', 'both'], default: 'borrower' },
  isLender: { type: Boolean, default: false },
  verification_status: { type: String, default: 'pending' },
  credit_score: { type: Number, default: 600 },

  // Location (used in matchmaking)
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    state: { type: String }
  },

  // Matching preferences
  amount: { type: Number, default: 0 },
  term: { type: Number, default: 0 },
  purpose: { type: String },
  rating: { type: Number, default: 4.5 }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
