const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/', loanController.createLoan);
router.get('/matches', loanController.getMatchedLoans);
router.patch('/accept', loanController.acceptLoanRequest);
router.get('/notifications', loanController.getNotifications);
router.get('/status/:borrowerId', loanController.getLoanStatusForBorrower);
router.get('/matches', loanController.getMatchedLoans);

module.exports = router;
