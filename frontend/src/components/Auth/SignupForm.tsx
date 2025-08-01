import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updateUserLocation } from '../../hooks/updateUserLocation';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: 'borrower',
    city: '',
    state: '',
    amount: '',
    term: '',
    password: '',
    latitude: 0,
    longitude: 0,
  });

  const [error, setError] = useState('');

  // 📍 Get user's location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to fetch location. Please allow location access.');
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Signup user
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      const user = res.data.user;

      // Step 2: Update user location on backend
      await updateUserLocation(user._id, formData.latitude, formData.longitude);

      alert('Signup successful!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        >
          <option value="borrower">Borrower</option>
          <option value="lender">Lender</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Loan Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="term"
          placeholder="Loan Term (months)"
          value={formData.term}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        {/* Location display (optional) */}
        {formData.latitude && formData.longitude && (
          <p className="text-sm text-gray-500 mb-2">
            📍 Location: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </p>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
