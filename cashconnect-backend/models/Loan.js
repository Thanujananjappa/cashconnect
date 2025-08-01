const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    charges: { type: Number, required: true },
    purpose: { type: String, default: 'Cash Request' },
    term: { type: Number, default: 1 },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: (v) => Array.isArray(v) && v.length === 2
      },
    },
    lenderConfirmed: { type: Boolean, default: false },
    borrowerConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

loanSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Loan', loanSchema);
