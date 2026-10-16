import { useCallback, useEffect, useState } from 'react';

export function useAsync(loader) {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState({ tick: -1, data: null, failure: null });

  useEffect(() => {
    let cancelled = false;

    loader().then(({ data, failure }) => {
      if (cancelled) return;
      setResult({ tick, data, failure });
    });

    return () => {
      cancelled = true;
    };
  }, [loader, tick]);

  const reload = useCallback(() => setTick(value => value + 1), []);

  return {
    data: result.data,
    failure: result.tick === tick ? result.failure : null,
    loading: result.tick !== tick,
    reload,
  };
}
