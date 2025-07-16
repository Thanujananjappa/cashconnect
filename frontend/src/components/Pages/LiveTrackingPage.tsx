import React from 'react';
import { useLocation } from 'react-router-dom';
import { LiveMap } from '../Maps/LiveMap';

export const LiveTrackingPage = () => {
  const location = useLocation();
  const {
    borrowerLocation,
    lenderLocation,
    phoneNumbers,
  } = location.state || {};

  if (!borrowerLocation || !lenderLocation) {
    return <p className="text-center mt-10 text-red-500">Missing location data</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Live Meeting Point</h1>

      <div className="mb-4 text-gray-600">
        📞 <strong>Borrower:</strong> {phoneNumbers?.borrower || 'Hidden'} <br />
        📞 <strong>You (Lender):</strong> {phoneNumbers?.lender || 'Hidden'}
      </div>

      <LiveMap borrowerLocation={borrowerLocation} lenderLocation={lenderLocation} />
    </div>
  );
};
