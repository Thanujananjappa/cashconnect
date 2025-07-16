import { useEffect, useState } from "react";
import axios from "axios";

export interface Stats {
  totalBorrowed: number;
  totalLent: number;
  activeMatches: number;
  pendingRequests: number;
}

export const useStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get<Stats>(`http://localhost:5000/api/stats/${userId}`);
        setStats(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
};
