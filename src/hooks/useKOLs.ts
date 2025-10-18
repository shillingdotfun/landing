// src/hooks/useKOLs.ts

import { useState, useEffect } from 'react';
import { kolsService } from '../services/kols.service';
import { KOL } from '../types/kol.types';


export const useKOLs = (limit = 10) => {
  const [kols, setKols] = useState<KOL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKOLs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const fetchKOLs = async () => {
    try {
      setLoading(true);
      const response = await kolsService.getLeaderboard({ perPage: limit });
      setKols(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching KOLs');
    } finally {
      setLoading(false);
    }
  };

  return {
    kols,
    loading,
    error,
    refetch: fetchKOLs,
  };
};
