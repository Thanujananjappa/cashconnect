// src/pages/LenderDashboard.tsx
import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLoanRequest } from '../../hooks/useLoanRequest';
import { updateUserLocation } from '../../hooks/updateUserLocation';

interface Loan {
  _id: string;
  amount: number;
  status: string;
  purpose: string;
  borrower: {
    full_name: string;
    phone: string;
    location: {
      coordinates: [number, number]; // [lng, lat]
    };
  };
}

const BACKEND_URL = 'http://localhost:5000';

export const LenderDashboard = () => {
  const { user } = useAuth();
  const { loanRequests, loading, error, fetchMatchedLoans } = useLoanRequest();
  const [totalLent, setTotalLent] = useState(0);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null); // [lng, lat]
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndUpdateLocation = () => {
      if (navigator.geolocation && user?._id) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await updateUserLocation(user._id, latitude, longitude);
              setUserLocation([longitude, latitude]);
            } catch (err) {
              console.error('❌ Failed to update user location:', err);
            }
          },
          async () => {
            const fallbackLat = 12.9716;
            const fallbackLng = 77.5946;
            try {
              await updateUserLocation(user._id, fallbackLat, fallbackLng);
              setUserLocation([fallbackLng, fallbackLat]);
            } catch (e) {
              console.error('❌ Failed to fallback location', e);
            }
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    };

    fetchAndUpdateLocation();
  }, [user]);

  useEffect(() => {
    setTotalLent(8750); // Placeholder for now
  }, []);

  const handleAccept = async (loanId: string) => {
    if (!user?._id || !userLocation) {
      alert('⚠️ Cannot proceed without current location.');
      return;
    }

    try {
      const response = await axios.patch(`${BACKEND_URL}/api/loans/accept`, {
        loanId,
        lenderId: user._id,
      });

      const matchedLoan = response.data;
      const borrowerCoords = matchedLoan?.borrower?.location?.coordinates;

      if (!borrowerCoords || borrowerCoords.length !== 2) {
        alert('⚠️ Borrower location not found.');
        return;
      }

      const borrowerLat = borrowerCoords[1];
      const borrowerLng = borrowerCoords[0];

      // ✅ FIXED: Redirect within /dashboard
      navigate(`/dashboard/live-tracking?lat=${borrowerLat}&lng=${borrowerLng}`);

      fetchMatchedLoans();
    } catch (err: any) {
      console.error('❌ Accept loan error:', err);
      if (err?.response?.status === 409) {
        alert('⚠️ This loan was already accepted by someone else.');
      } else {
        alert('❌ Could not accept the loan.');
      }
    }
  };

  if (!user) {
    return <p className="p-6 text-red-500">User not logged in.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome {user.full_name || 'Lender'}!</h1>
      <p className="mb-6 text-gray-600">View and fulfill travel cash requests near you.</p>

      {/* Summary Cards */}
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
          <h3 className="text-2xl font-bold">{loanRequests.length}</h3>
          <p className="text-sm text-gray-600">Live Cash Requests</p>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">📋 Nearby Requests</h2>

        {loading && <p className="text-gray-500">Loading cash requests...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && loanRequests.length === 0 && (
          <p className="text-gray-500">No new cash requests nearby.</p>
        )}

        {!loading && !error && loanRequests.length > 0 && (
          <div className="space-y-4">
            {loanRequests.map((loan: Loan) => (
              <div key={loan._id} className="border p-4 rounded hover:shadow transition">
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
