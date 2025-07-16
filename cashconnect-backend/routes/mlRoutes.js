const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');

// ✅ GET /api/ml/recommend
router.get('/recommend', mlController.getRecommendations);

module.exports = router;
