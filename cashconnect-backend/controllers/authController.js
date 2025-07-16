const User = require('../models/User');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Determine if user is a lender
    const isLender = user_type === 'lender' || user_type === 'both';

    // Create user in DB
    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone,
      user_type,
      isLender,
      amount: amount || 0, // ✅ store from frontend request
      term: term || 0,     // ✅ store from frontend request
      location,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// POST /api/auth/login
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { signUp, signIn };
