import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useEvents(gridStart, gridEnd) {
  const [result, setResult] = useState({ key: '', events: [], error: false });

  const from = gridStart.toISOString();
  const to = gridEnd.toISOString();
  const key = `${from}|${to}`;

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('events')
      .select('*')
      .gte('starts_at', from)
      .lt('starts_at', to)
      .order('starts_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        setResult({ key: `${from}|${to}`, events: error ? [] : data ?? [], error: !!error });
      });

    return () => { cancelled = true; };
  }, [from, to]);

  const status = result.key !== key ? 'loading' : result.error ? 'error' : 'ok';

  return { events: result.events, status };
}
