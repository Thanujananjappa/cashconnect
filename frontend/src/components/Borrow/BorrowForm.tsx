// ✅ BorrowForm.tsx (Cleaned, middleware-free version)
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const BorrowForm = () => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [charges, setCharges] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.error('Location error:', err);
        setError('Location access denied. Please enable location.');
      }
    );
  }, []);

  useEffect(() => {
    const amt = parseFloat(amount);
    if (!isNaN(amt)) {
      const calcCharges = +(amt * 0.05).toFixed(2);
      const total = +(amt + calcCharges).toFixed(2);
      setCharges(calcCharges);
      setFinalAmount(total);
    } else {
      setCharges(0);
      setFinalAmount(0);
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || !purpose || !location.latitude || !location.longitude) {
      setError('All fields are required and location must be allowed.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    try {
      const response = await axios.post(
  '/api/loans/create',
  {
    amount: parseFloat(amount),
    purpose,
    charges,
    finalAmount,
    latitude: location.latitude,
    longitude: location.longitude,
    borrowerId: user?._id, // ✅ ADD THIS
  },
  {
    headers: {
      Authorization: `Bearer ${token}`, // optional now, but ok to keep
    },
  }
);


      setSuccess('Loan request submitted successfully!');
      setAmount('');
      setPurpose('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      console.error('Loan request error:', err);
      const msg = err?.response?.data?.error || 'Failed to submit loan request';
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Request Instant Currency Exchange</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="text-sm text-gray-600">
            Processing Fee (5%): ₹{charges} <br />
            <strong>Total Payable: ₹{finalAmount}</strong>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>

          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default BorrowForm;
