import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCategories() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.from('wiki_categories').select('*').order('sort_order').then(({ data: d, error: e }) => {
      if (e) { setError(e); setData([]); return; }
      setData(d ?? []);
    });
  }, []);
  return { data, error };
}

export function useWikiTree() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.from('wiki_categories')
      .select('*, wiki_pages(id, title, slug, sort_order)')
      .order('sort_order')
      .order('sort_order', { foreignTable: 'wiki_pages' })
      .then(({ data: d, error: e }) => {
        if (e) { setError(e); setData([]); return; }
        setData(d ?? []);
      });
  }, []);
  return { data, error };
}

export function usePage(slug) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!slug) { setData(null); return; }
    setData(undefined);
    setError(null);
    supabase.from('wiki_pages').select('*, wiki_categories(name, slug, icon)').eq('slug', slug).single()
      .then(({ data: d, error: e }) => {
        if (e) { setError(e); setData(null); return; }
        setData(d ?? null);
      });
  }, [slug]);
  return { data, error };
}

export function usePagesByCategory(categorySlug) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!categorySlug) { setData([]); return; }
    setData(null);
    setError(null);
    supabase.from('wiki_pages')
      .select('id, title, slug, sort_order, updated_at, wiki_categories!inner(slug)')
      .eq('wiki_categories.slug', categorySlug).order('sort_order')
      .then(({ data: d, error: e }) => {
        if (e) { setError(e); setData([]); return; }
        setData(d ?? []);
      });
  }, [categorySlug]);
  return { data, error };
}

export function useSearch(query) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!query || query.trim().length < 2) { setData(null); setError(null); return; }
    supabase.from('wiki_pages').select('id, title, slug, wiki_categories(name, slug, icon)')
      .ilike('title', `%${query.trim()}%`).limit(12)
      .then(({ data: d, error: e }) => {
        if (e) { setError(e); setData([]); return; }
        setData(d ?? []);
      });
  }, [query]);
  return { data, error };
}
