import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCategories() {
  const [data, setData] = useState(null);
  useEffect(() => {
    supabase.from('wiki_categories').select('*').order('sort_order').then(({ data: d }) => setData(d ?? []));
  }, []);
  return data;
}

export function usePage(slug) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    if (!slug) { setData(null); return; }
    setData(undefined);
    supabase.from('wiki_pages').select('*, wiki_categories(name, slug, icon)').eq('slug', slug).single()
      .then(({ data: d }) => setData(d ?? null));
  }, [slug]);
  return data;
}

export function usePagesByCategory(categorySlug) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!categorySlug) { setData([]); return; }
    supabase.from('wiki_pages')
      .select('id, title, slug, sort_order, updated_at, wiki_categories!inner(slug)')
      .eq('wiki_categories.slug', categorySlug).order('sort_order')
      .then(({ data: d }) => setData(d ?? []));
  }, [categorySlug]);
  return data;
}

export function useSearch(query) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!query || query.trim().length < 2) { setData(null); return; }
    supabase.from('wiki_pages').select('id, title, slug, wiki_categories(name, slug, icon)')
      .ilike('title', `%${query.trim()}%`).limit(12)
      .then(({ data: d }) => setData(d ?? []));
  }, [query]);
  return data;
}
