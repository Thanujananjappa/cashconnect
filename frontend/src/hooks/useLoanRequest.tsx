// ✅ /frontend/src/hooks/useLoanRequest.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useLoanRequest = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchedLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/loans/matches');
      setLoanRequests(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Failed to fetch nearby cash requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedLoans();
  }, []);

  return {
    loanRequests,
    loading,
    error,
    fetchMatchedLoans,
  };
};
