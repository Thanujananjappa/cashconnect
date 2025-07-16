import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { BorrowerDashboard } from './BorrowDashboard';
import { LenderDashboard } from './LenderDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.user_type === 'lender') return <LenderDashboard />;
  if (user.user_type === 'borrower') return <BorrowerDashboard />;
  if (user.user_type === 'both')
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-gray-900">You're both a lender and borrower!</h2>
        <p className="text-gray-600 mt-2">Please choose a view to continue.</p>
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => window.location.href = '/dashboard/lend'}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            Lender View
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/borrow'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Borrower View
          </button>
        </div>
      </div>
    );

  return <div>Error: Unknown user role</div>;
};
