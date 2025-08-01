// 📁 utils/reverseGeocode.js
const axios = require('axios');

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          format: 'json',
          lat: latitude,
          lon: longitude,
        },
        headers: {
          'User-Agent': 'CashConnectApp/1.0', // required by Nominatim
        },
      }
    );

    // Return the structured address object
    return response.data?.address || {};
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return {};
  }
};

module.exports = getAddressFromCoordinates;
