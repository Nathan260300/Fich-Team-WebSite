import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    setData(null);
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setData(d); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, [url]);

  return { data, status };
}
