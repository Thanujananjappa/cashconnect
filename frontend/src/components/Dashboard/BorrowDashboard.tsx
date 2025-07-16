// 📁 components/Pages/BorrowerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { DollarSign, Users, MapPin, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import axios from 'axios';

interface Lender {
  _id: string;
  full_name: string;
  phone: string;
  distance?: number;
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export const BorrowerDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications(user?.id);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [matchedLenders, setMatchedLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setTotalBorrowed(12500);

    axios.get(`/api/loans/status/${user._id}`)
      .then(res => setActiveLoan(res.data))
      .catch(() => setActiveLoan(null));

    setLoading(true);
    axios.get(`/api/loans/matches`, {
      params: {
        latitude: user?.location?.latitude,
        longitude: user?.location?.longitude,
      }
    })
      .then(res => {
        setMatchedLenders(res.data);
        setError(null);
      })
      .catch(() => {
        setMatchedLenders([]);
        setError('Failed to fetch nearby lenders.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome back, {user?.full_name || 'Borrower'}!
      </h1>
      <p className="text-gray-600 mb-6">Here’s your borrowing overview.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalBorrowed}</h3>
          <p className="text-sm text-gray-600">Total Borrowed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{notifications.length}</h3>
          <p className="text-sm text-gray-600">Matches</p>
        </div>
      </div>

      {/* Loan Status */}
      {activeLoan && (
        <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Request Status</h2>
          <p className="mb-2">Status: <strong>{activeLoan.status}</strong></p>
          {activeLoan.status === 'pending' ? (
            <p className="text-orange-600">Waiting for a lender to accept your request.</p>
          ) : (
            <div className="text-green-700">
              ✅ Accepted by {activeLoan.lender?.full_name}<br />
              📞 {activeLoan.lender?.phone}<br />
              <MapPin className="inline w-4 h-4 mr-1" />
              {activeLoan.lender?.location?.coordinates?.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Nearby Lenders */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Nearby Lenders</h2>

        {loading ? (
          <p className="text-gray-500">Loading nearby lenders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : matchedLenders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedLenders.map((lender, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
                <h3 className="text-lg font-semibold text-gray-900">{lender.full_name}</h3>
                <p className="text-sm text-gray-600">📞 {lender.phone}</p>
                <div className="mt-2 text-sm text-gray-700 flex justify-between">
                  <span>📍 {lender.distance?.toFixed(2)} km</span>
                  {lender.rating && (
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {lender.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No lenders found nearby.</p>
        )}
      </div>
    </div>
  );
};
