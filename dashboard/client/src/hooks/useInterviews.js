import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useInterviews(params = {}) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getInterviews(params);
      setInterviews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  return { interviews, loading, error, refetch: fetchInterviews };
}
