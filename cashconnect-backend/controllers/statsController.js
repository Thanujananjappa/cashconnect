const Loan = require('../models/Loan');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const totalBorrowed = await Loan.aggregate([
      { $match: { borrower: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalLent = await Loan.aggregate([
      { $match: { lender: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const activeMatches = await Loan.countDocuments({
      $or: [{ lender: userId }, { borrower: userId }],
      status: 'active',
    });

    const pendingRequests = await Loan.countDocuments({
      $or: [{ lender: userId }, { borrower: userId }],
      status: 'pending',
    });

    res.json({
      totalBorrowed: totalBorrowed[0]?.total || 0,
      totalLent: totalLent[0]?.total || 0,
      activeMatches,
      pendingRequests,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};
