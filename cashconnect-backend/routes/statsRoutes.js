const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const loansAsBorrower = await Loan.find({ borrower: userId });
    const loansAsLender = await Loan.find({ lender: userId });

    const totalBorrowed = loansAsBorrower.reduce((sum, loan) => sum + loan.amount, 0);
    const totalLent = loansAsLender.reduce((sum, loan) => sum + loan.amount, 0);

    const activeMatches = await Loan.countDocuments({
      $or: [{ lender: userId }, { borrower: userId }],
      status: 'approved'
    });

    const pendingRequests = await Loan.countDocuments({
      $or: [{ lender: userId }, { borrower: userId }],
      status: 'pending'
    });

    res.json({
      totalBorrowed,
      totalLent,
      activeMatches,
      pendingRequests
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
