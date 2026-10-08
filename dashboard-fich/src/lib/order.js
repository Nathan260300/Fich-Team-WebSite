import { supabase } from './supabase';

export async function persistOrder(table, list) {
  const results = await Promise.all(
    list.map((row, index) => supabase.from(table).update({ sort_order: index }).eq('id', row.id))
  );
  return results.find(r => r.error)?.error ?? null;
}

export async function nextSortOrder(table) {
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}
