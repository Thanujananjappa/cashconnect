// ✅ controllers/loanController.js
const Loan = require('../models/Loan');
const User = require('../models/User');
const { calculateDistance } = require('../utils/haversine');

const calculateFinalAmount = (baseAmount) => {
  const deliveryFee = 20;
  const maintenanceFee = 0.03;
  const taxRate = 0.05;
  const maintenance = baseAmount * maintenanceFee;
  const tax = baseAmount * taxRate;
  return Math.round(baseAmount + deliveryFee + maintenance + tax);
};

const createLoan = async (req, res) => {
  try {
    const { amount, borrower, location, note } = req.body;
    if (!amount || !borrower || !location?.coordinates?.length) {
      return res.status(400).json({ message: '❌ Missing required fields' });
    }
    const finalAmount = calculateFinalAmount(amount);
    const loan = await Loan.create({
      amount,
      finalAmount,
      purpose: 'Cash on Travel',
      term: 1,
      maxRate: 0,
      description: note || '',
      notes: note || '',
      borrower,
      lender: null,
      location,
      status: 'pending',
    });
    console.log(`📥 New loan created: ₹${amount} → Final: ₹${finalAmount}`);
    res.status(201).json(loan);
  } catch (err) {
    console.error('❌ Error creating loan:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getMatchedLoans = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const lat1 = parseFloat(latitude);
    const lon1 = parseFloat(longitude);

    const lenders = await User.find({ user_type: { $in: ['lender', 'both'] } });
    const matched = lenders.map((lender) => {
      const lat2 = lender.location?.latitude || 0;
      const lon2 = lender.location?.longitude || 0;
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      return {
        _id: lender._id,
        full_name: lender.full_name,
        phone: lender.phone,
        location: lender.location,
        rating: lender.rating,
        distance: distance,
      };
    });

    const sorted = matched.sort((a, b) => a.distance - b.distance);
    res.status(200).json(sorted.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const acceptLoanRequest = async (req, res) => {
  const { loanId, lenderId } = req.body;
  if (!loanId || !lenderId) {
    return res.status(400).json({ message: '❌ loanId and lenderId required' });
  }
  try {
    const loan = await Loan.findOneAndUpdate(
      { _id: loanId, status: 'pending', lender: null },
      { lender: lenderId, status: 'funded' },
      { new: true }
    ).populate([
      { path: 'borrower', select: 'full_name phone location' },
      { path: 'lender', select: 'full_name phone location' },
    ]);
    if (!loan) {
      return res.status(409).json({ message: '❌ Already accepted or not found' });
    }
    console.log(`✅ Loan accepted by lender ${lenderId}`);
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLoanStatusForBorrower = async (req, res) => {
  const { borrowerId } = req.params;
  try {
    const loan = await Loan.findOne({
      borrower: borrowerId,
      status: { $in: ['pending', 'funded'] },
    }).populate([
      { path: 'borrower', select: 'full_name phone location' },
      { path: 'lender', select: 'full_name phone location' },
    ]);
    if (!loan) {
      return res.status(404).json({ message: 'No active request found' });
    }
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const fundedLoans = await Loan.find({ status: 'funded' }).populate([
      { path: 'borrower', select: 'full_name phone location' },
      { path: 'lender', select: 'full_name phone location' },
    ]);
    res.status(200).json(fundedLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createLoan,
  getMatchedLoans,
  acceptLoanRequest,
  getLoanStatusForBorrower,
  getNotifications,
};
