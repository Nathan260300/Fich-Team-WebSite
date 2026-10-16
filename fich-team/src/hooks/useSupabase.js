import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { reportSupabaseError } from '../lib/serviceStatus';

export function useSupabase(table, options = {}) {
  const { select = '*', order = 'sort_order', single = false, essential = false } = options;
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    setData(null);

    let query = supabase.from(table).select(select);
    if (order) query = query.order(order, { ascending: true });
    if (single) query = query.single();

    query.then(({ data: d, error, status: httpStatus }) => {
      if (error) {
        reportSupabaseError(error, { status: httpStatus, essential, source: table });
        setStatus('error');
        return;
      }
      setData(d);
      setStatus('ok');
    });
  }, [table]);

  return { data, status };
}
