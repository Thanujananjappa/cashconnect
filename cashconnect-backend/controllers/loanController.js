const Loan = require('../models/Loan');
const User = require('../models/User');
const { calculateDistance } = require('../utils/haversine');

const calculateCharges = (amount) => (amount * 5) / 100;

// ================== CREATE LOAN ==================
exports.createLoan = async (req, res) => {
  try {
    const { amount, purpose, latitude, longitude, charges, finalAmount, borrowerId } = req.body;

    if (!borrowerId || !amount || !purpose || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const user = await User.findById(borrowerId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const calcCharges = charges ?? calculateCharges(amount);
    const calcFinal = finalAmount ?? (parseFloat(amount) + calcCharges);

    const loan = await Loan.create({
      amount: parseFloat(amount),
      charges: calcCharges,
      finalAmount: calcFinal,
      purpose,
      borrower: borrowerId,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      status: 'pending'
    });

    const populatedLoan = await Loan.findById(loan._id)
      .populate('borrower', 'full_name phone location email profile_pic');

    res.status(201).json({ success: true, loan: populatedLoan });
  } catch (err) {
    console.error('❌ Error in createLoan:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ================== GET NEARBY LENDERS ==================
exports.getMatchedLoans = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.query;
    let userCoords;

    if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!user.location?.coordinates) {
        return res.status(400).json({ error: 'User location not set' });
      }

      userCoords = user.location.coordinates;
    } else if (latitude && longitude) {
      userCoords = [parseFloat(longitude), parseFloat(latitude)];
    } else {
      return res.status(400).json({ error: 'userId or (latitude & longitude) required' });
    }

    const lenders = await User.find({ user_type: { $in: ['lender', 'both'] } });

    const matchedLenders = lenders
      .filter((lender) => {
        if (!lender.location?.coordinates) return false;

        const dist = calculateDistance(
          userCoords[1], userCoords[0],
          lender.location.coordinates[1], lender.location.coordinates[0]
        );

        lender.distance = dist;
        return dist <= 10;
      })
      .map((lender) => ({
        _id: lender._id,
        full_name: lender.full_name,
        phone: lender.phone,
        location: lender.location,
        rating: lender.rating || 4.5,
        distance: lender.distance,
      }));

    res.json({ matches: matchedLenders });
  } catch (err) {
    console.error('❌ Error in getMatchedLoans:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ================== GET LOAN STATUS (BY BORROWER) ==================
exports.getLoanStatusForBorrower = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      borrower: req.params.borrowerId,
      status: { $in: ['pending', 'accepted'] }
    }).populate(['borrower', 'lender']);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'No active loan' });
    }

    res.status(200).json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ================== GET LOAN STATUS (BY LOAN ID) ==================
exports.getLoanStatusByLoanId = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId).populate(['borrower', 'lender']);
    if (!loan) {
      return res.status(404).json({ success: false, error: 'Loan not found' });
    }

    res.status(200).json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ================== GET ACCEPTED LOANS / NOTIFICATIONS ==================
exports.getNotifications = async (req, res) => {
  try {
    const acceptedLoans = await Loan.find({ status: 'accepted' }).populate(['borrower', 'lender']);
    res.status(200).json({ success: true, notifications: acceptedLoans });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ================== GET COUNTERPARTY LOCATIONS ==================
exports.getCounterpartyLocation = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId).populate(['borrower', 'lender']);
    if (!loan) {
      return res.status(404).json({ success: false, error: 'Loan not found' });
    }

    const borrowerCoords = loan.borrower?.location?.coordinates ?? [];
    const lenderCoords = loan.lender?.location?.coordinates ?? [];

    const distance = calculateDistance(
      borrowerCoords[1], borrowerCoords[0],
      lenderCoords[1], lenderCoords[0]
    );

    res.status(200).json({
      success: true,
      borrower: { name: loan.borrower?.full_name, coordinates: borrowerCoords },
      lender: { name: loan.lender?.full_name, coordinates: lenderCoords },
      distance_km: distance.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ================== CONFIRM LOAN EXCHANGE ==================
exports.confirmExchange = async (req, res) => {
  try {
    const { loanId, role } = req.body;

    if (!loanId || !['lender', 'borrower'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Missing or invalid fields' });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ success: false, error: 'Loan not found' });

    if (role === 'lender') loan.lenderConfirmed = true;
    else loan.borrowerConfirmed = true;

    if (loan.lenderConfirmed && loan.borrowerConfirmed) {
      loan.status = 'funded';
    }

    await loan.save();

    res.status(200).json({
      success: true,
      message: `${role} confirmed exchange`,
      loan,
    });
  } catch (err) {
    console.error('❌ Error in confirmExchange:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
