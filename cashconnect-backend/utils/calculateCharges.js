// utils/calculateCharges.js

/**
 * Calculate final amount with delivery, maintenance, and tax
 * @param {number} baseAmount
 * @returns {number} finalAmount
 */
const calculateFinalAmount = (baseAmount) => {
  const deliveryFee = 20;           // Flat delivery fee
  const maintenanceFee = 0.03;      // 3% maintenance
  const taxRate = 0.05;             // 5% tax

  const maintenance = baseAmount * maintenanceFee;
  const tax = baseAmount * taxRate;

  return Math.round(baseAmount + deliveryFee + maintenance + tax);
};

module.exports = { calculateFinalAmount };
