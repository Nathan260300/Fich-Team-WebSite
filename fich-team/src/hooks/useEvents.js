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

export function useEventById(id) {
  const [result, setResult] = useState({ id: null, event: null });

  useEffect(() => {
    if (!id) return undefined;
    let cancelled = false;

    supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setResult({ id, event: data ?? null });
      });

    return () => { cancelled = true; };
  }, [id]);

  const settled = Boolean(id) && result.id === id;
  return { event: settled ? result.event : null, settled };
}
