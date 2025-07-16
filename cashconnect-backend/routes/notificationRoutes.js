const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// ✅ Get notifications for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('❌ Notification fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

module.exports = router;
