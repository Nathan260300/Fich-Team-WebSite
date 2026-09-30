import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLegalPage(slug) {
  const [result, setResult] = useState({ slug: null, page: null, status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('legal_pages')
      .select('slug, title, content, updated_at')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setResult({ slug, page: null, status: 'error' });
        else if (!data) setResult({ slug, page: null, status: 'empty' });
        else setResult({ slug, page: data, status: 'ok' });
      });

    return () => { cancelled = true; };
  }, [slug]);

  // Tant que le résultat ne correspond pas au slug demandé, on est en chargement
  return result.slug === slug ? result : { slug, page: null, status: 'loading' };
}
