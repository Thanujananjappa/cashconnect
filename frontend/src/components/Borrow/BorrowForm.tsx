import React, { useState, useEffect } from 'react';
import { DollarSign, FileText } from 'lucide-react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const BorrowForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const lenderId = location.state?.lenderId ?? null;

  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    description: ''
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [finalAmount, setFinalAmount] = useState<number>(0);

  const purposes = [
    'ATM not available',
    'UPI not accepted',
    'Cash for Emergency',
    'Food Stall',
    'Transportation',
    'Other'
  ];

  useEffect(() => {
    // Recalculate final amount whenever the amount input changes
    const base = parseFloat(formData.amount) || 0;
    const deliveryCharge = 10; // ₹10 delivery
    const maintenanceFee = 5;  // ₹5 app fee
    const tax = base * 0.02;   // 2% tax
    const total = base + deliveryCharge + maintenanceFee + tax;
    setFinalAmount(Number(total.toFixed(2)));
  }, [formData.amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('❌ Please log in to request cash.');
      setIsError(true);
      return;
    }

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        finalAmount, // send calculated amount
        purpose: formData.purpose,
        description: formData.description,
        notes: formData.description,
        borrower: user._id,
        lender: lenderId || null,
        location: {
          type: 'Point',
          coordinates: [
            user.location?.longitude || 77.5946,
            user.location?.latitude || 12.9716,
          ]
        }
      };

      await axios.post('/api/loans', payload);
      setIsError(false);
      setMessage('✅ Request sent! Awaiting response from nearby lender...');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setIsError(true);
      setMessage('❌ Failed to send request.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-6">Request Nearby Cash</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount Needed (₹)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E.g. 300"
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Why do you need cash?</label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Situation</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="E.g. I'm stuck without cash at a small food stall."
              required
            />
          </div>

          {/* Final Calculated Amount */}
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold">
              💰 You will receive ₹{formData.amount || '0'} but total payable is <strong>₹{finalAmount}</strong> (includes delivery, maintenance & tax)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Cash Request
          </button>

          {message && (
            <p className={`text-sm mt-4 font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};
