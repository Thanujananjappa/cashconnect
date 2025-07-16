// src/hooks/useNotifications.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LoanMatch } from '../types';

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<LoanMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get('/api/notifications', {
          params: { user_id: userId },
        });
        setNotifications(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  return { notifications, loading, error };
};
