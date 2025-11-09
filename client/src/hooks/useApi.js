import { useState, useEffect } from 'react';
import api from '../api/apiClient';

export default function useApi(endpoint, { method = 'get', body = null, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api[method](endpoint, body)
      .then(res => { if (mounted) setData(res.data); })
      .catch(err => { if (mounted) setError(err?.response?.data || err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, deps);

  return { data, loading, error, setData };
}
