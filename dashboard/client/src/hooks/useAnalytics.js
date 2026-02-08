import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useAnalytics() {
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, t, p] = await Promise.all([
          api.getSummary(),
          api.getTimeline(),
          api.getPipeline(),
        ]);
        setSummary(s);
        setTimeline(t);
        setPipeline(p);
      } catch (err) {
        console.error('Analytics fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { summary, timeline, pipeline, loading };
}
