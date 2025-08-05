const express = require('express');
const router = express.Router();
const {
  createLoan,
  getMatchedLoans,
  acceptLoanRequest,
  getLoanStatusForBorrower,
  getLoanStatusByLoanId,
  getNotifications,
  getCounterpartyLocation,
  confirmExchange
} = require('../controllers/loanController');

// Routes
router.post('/create', createLoan);
router.get('/match', getMatchedLoans);
router.patch('/accept', acceptLoanRequest);
router.get('/status/:borrowerId', getLoanStatusForBorrower);
router.get('/loan-status/:loanId', getLoanStatusByLoanId);
router.get('/notifications', getNotifications);
router.get('/:loanId/location', getCounterpartyLocation);
router.post('/confirm-exchange', confirmExchange);

module.exports = router;
