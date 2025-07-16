// 📁 components/LenderCard.tsx
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LenderCard = ({ lender }: { lender: any }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
      onClick={() => navigate('/dashboard/borrow', { state: { lenderId: lender._id } })}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-3 bg-blue-500" />
          <span className="font-medium text-gray-900">{lender.full_name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {lender.distance?.toFixed(2)} km
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Rating</p>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold">{lender.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
