// 📁 routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const getAddressFromCoordinates = require('../utils/reverseGeocode');

// Utility: Extract city and state from address object
const extractCity = (address) =>
  address?.city || address?.town || address?.village || 'Unknown City';

const extractState = (address) =>
  address?.state || address?.region || 'Unknown State';

/**
 * @route   PATCH /api/users/:id/location
 * @desc    Update user location by user ID
 * @access  Public (you can protect it with auth middleware if needed)
 */
router.patch('/:id/location', async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Get address via reverse geocoding
    const address = await getAddressFromCoordinates(latitude, longitude);

    const city = extractCity(address);
    const state = extractState(address);

    // Update the user's location
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        location: {
          latitude,
          longitude,
          city,
          state,
          coordinates: [longitude, latitude], // GeoJSON format
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Location updated successfully',
      location: updatedUser.location,
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Server error while updating location' });
  }
});

module.exports = router;
