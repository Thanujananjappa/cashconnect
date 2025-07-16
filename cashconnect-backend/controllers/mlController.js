exports.getRecommendations = (req, res) => {
  const { lat, lon, role, amount, term } = req.query;

  // Dummy recommendation logic - replace with ML later if needed
  if (!lat || !lon || !role) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  // Example output: send 3 nearby lender mock profiles
  if (role === 'borrower') {
    return res.json([
      {
        _id: 'lender1',
        full_name: 'Anjali Verma',
        distance: 1.2,
        rating: 4.8,
        amount_range: '₹1000 - ₹5000'
      },
      {
        _id: 'lender2',
        full_name: 'Ravi Kumar',
        distance: 2.5,
        rating: 4.5,
        amount_range: '₹2000 - ₹8000'
      },
      {
        _id: 'lender3',
        full_name: 'Sneha Rao',
        distance: 3.8,
        rating: 4.9,
        amount_range: '₹1500 - ₹10000'
      }
    ]);
  }

  return res.json([]);
};
