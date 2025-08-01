// 📂 /components/Dashboard/AvailableLoans.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

export const AvailableLoans: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
const response = await axios.get('/api/loans/matches', {
  params: {
    latitude: user.location.latitude,
    longitude: user.location.longitude,
  },
});        setLoans(response.data);
      } catch (err: any) {
        setError('❌ Failed to fetch loans.');
      }
    };
    fetchLoans();
  }, []);

  const handleAccept = async (loanId: string) => {
    try {
      const response = await axios.post('/api/loans/accept', {
        loanId,
        lenderId: user._id,
      });
      setMessage('✅ You accepted the loan request.');
      setLoans(loans.filter((loan) => loan._id !== loanId));
    } catch (err: any) {
      setError('❌ Could not accept loan. It might have already been taken.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📬 Available Loan Requests</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loans.length === 0 ? (
        <p className="text-gray-500">No open loan requests available.</p>
      ) : (
        <ul className="space-y-4">
          {loans.map((loan) => (
            <li
              key={loan._id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                💰 ₹{loan.amount} — {loan.purpose}
              </h3>
              <p className="text-gray-600 text-sm">
                Term: {loan.term} months<br />
                Rate: Up to {loan.maxRate}%<br />
                Borrower: {loan.borrower?.full_name || 'Anonymous'}
              </p>
              <button
                onClick={() => handleAccept(loan._id)}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Accept Request
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
