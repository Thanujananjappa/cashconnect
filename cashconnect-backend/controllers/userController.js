// 📁 controllers/userController.js
const User = require('../models/User');
const getAddressFromCoordinates = require('../utils/reverseGeocode');

// Utility: Safely extract city and state
const extractCity = (address) => {
  return address?.city || address?.town || address?.village || 'Unknown City';
};

const extractState = (address) => {
  return address?.state || address?.region || 'Unknown State';
};

// PATCH: /api/users/:id/location
const updateUserLocation = async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  // Validate input
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
  }

  try {
    // Get city/state from reverse geocode
    const address = await getAddressFromCoordinates(latitude, longitude);
    const city = extractCity(address);
    const state = extractState(address);

    // Update user location in DB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        location: {
          latitude,
          longitude,
          city,
          state,
          coordinates: [longitude, latitude], // GeoJSON [lng, lat]
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
    console.error('Error updating location:', error.message);
    res.status(500).json({ error: 'Server error while updating location' });
  }
};

module.exports = {
  updateUserLocation,
};
