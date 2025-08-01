const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Helper to get human-readable address
const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
    );
    const { city, state, postcode, country } = response.data.address;
    return `${city || ''}, ${state || ''}, ${country || ''}, ${postcode || ''}`;
  } catch (error) {
    console.error('Reverse geocoding failed:', error.message);
    return 'Unknown location';
  }
};

// POST /api/auth/signup
const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      user_type,
      location,
      amount,
      term,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const address = await getAddressFromCoordinates(location.lat, location.lon);
    const isLender = user_type === 'lender' || user_type === 'both';

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone,
      user_type,
      isLender,
      amount: amount || 0,
      term: term || 0,
      location: {
        ...location,
        address,
      },
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// POST /api/auth/login
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        user_type: user.user_type,
        isLender: user.isLender,
        amount: user.amount,
        term: user.term,
        location: user.location,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { signUp, signIn };
