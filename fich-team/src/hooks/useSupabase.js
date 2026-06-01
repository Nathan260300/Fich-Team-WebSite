import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabase(table, options = {}) {
  const { select = '*', order = 'sort_order', single = false } = options;
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    setData(null);

    let query = supabase.from(table).select(select);
    if (order) query = query.order(order, { ascending: true });
    if (single) query = query.single();

    query.then(({ data: d, error }) => {
      if (error) { setStatus('error'); return; }
      setData(d);
      setStatus('ok');
    });
  }, [table]);

  return { data, status };
}
