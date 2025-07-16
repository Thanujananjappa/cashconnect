// 📂 components/Pages/LenderDashboard.tsx
import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLoanRequest } from '../../hooks/useLoanRequest';

export const LenderDashboard = () => {
  const { user } = useAuth();
  const { loanRequests, loading, error } = useLoanRequest();
  const [totalLent, setTotalLent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTotalLent(8750); // Replace with real calculation later
  }, []);

  const handleAccept = async (loanId: string) => {
    try {
      const response = await axios.patch('/api/loans/accept', {
        loanId,
        lenderId: user?._id, // ✅ Make sure this is user._id, not id
      });

      const matchedLoan = response.data;

      // Navigate to live-tracking
      navigate('/live-tracking', {
        state: {
          borrowerLocation: {
            lat: matchedLoan.borrower?.location?.coordinates?.[1],
            lng: matchedLoan.borrower?.location?.coordinates?.[0],
          },
          lenderLocation: {
            lat: user?.location?.latitude,
            lng: user?.location?.longitude,
          },
          phoneNumbers: {
            borrower: matchedLoan.borrower?.phone || 'Hidden',
            lender: user?.phone || 'Hidden',
          },
        },
      });
    } catch (error: any) {
      console.error('❌ Error accepting loan:', error);
      const msg = error?.response?.data?.message || '❌ Could not accept request';
      alert(msg);
    }
  };

  // ✅ Debug fallback if user isn't loaded
  if (!user) return <p className="p-6 text-red-500">User not logged in.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome {user.full_name || 'Lender'}!</h1>
      <p className="mb-6 text-gray-600">View and fulfill travel cash requests from nearby users.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-500 p-3 rounded-lg">
              <TrendingUp className="text-white" />
            </div>
            <span className="text-emerald-600 text-sm">+8%</span>
          </div>
          <h3 className="text-2xl font-bold">₹{totalLent}</h3>
          <p className="text-sm text-gray-600">Total Given</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="text-white" />
            </div>
            <span className="text-orange-600 text-sm">Live</span>
          </div>
          <h3 className="text-2xl font-bold">{loanRequests?.length || 0}</h3>
          <p className="text-sm text-gray-600">Live Cash Requests</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">📋 Nearby Requests</h2>

        {loading && <p className="text-gray-500">Loading cash requests...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && loanRequests.length === 0 && (
          <p className="text-gray-500">No new cash requests found.</p>
        )}

        {!loading && !error && loanRequests.length > 0 && (
          <div className="space-y-4">
            {loanRequests.map((loan: any) => (
              <div key={loan._id} className="border p-4 rounded hover:shadow">
                <div className="flex justify-between">
                  <span className="font-semibold">{loan.borrower?.full_name || 'Borrower'}</span>
                  <span className="font-semibold text-green-600">₹{loan.amount}</span>
                </div>
                <p className="text-sm mt-1">{loan.purpose}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {loan.status}</p>
                <button
                  onClick={() => handleAccept(loan._id)}
                  className="mt-2 px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Give Cash
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
