const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/ml', require('./routes/mlRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // ✅ New route added for user location updates

// Root route
app.get('/', (req, res) => {
  res.send('🌐 CashConnect Backend API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


