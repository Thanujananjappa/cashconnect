const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    purpose: { type: String, default: 'Cash Request' },
    term: { type: Number, default: 1 },
    maxRate: { type: Number, default: 0 },
    description: { type: String, required: false, default: '' },
    notes: { type: String },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'funded', 'repaid'],
      default: 'pending',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: v => Array.isArray(v) && v.length === 2,
      },
    },
  },
  { timestamps: true }
);

loanSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Loan', loanSchema);

