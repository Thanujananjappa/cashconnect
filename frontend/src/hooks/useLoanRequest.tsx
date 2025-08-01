import { useEffect, useState } from 'react';
import axios from 'axios';

export const useLoanRequest = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchedLoans = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `http://localhost:5000/api/loans/match?latitude=${latitude}&longitude=${longitude}`,
            { withCredentials: true }
          );
          setLoanRequests(response.data.matches || []); // ✅ FIXED HERE
          setError(null);
        } catch (err) {
          console.error('❌ Error fetching loan matches:', err);
          setError('❌ Failed to fetch nearby cash requests');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('❌ Location access denied:', err.message);
        setError('❌ Please enable location to see requests nearby');
        setLoading(false);
      }
    );
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
