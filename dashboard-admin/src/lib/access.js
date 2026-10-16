import { supabaseCentral } from './supabaseCentral';
import { classifySupabaseError } from './supabaseErrors';

export const REQUEST_TIMEOUT_MS = 12000;

export async function fetchMyAccess() {
  const { data, error, status } = await supabaseCentral
    .rpc('get_my_access')
    .abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS));

  if (error) {
    return { ok: false, failure: classifySupabaseError(error, status) };
  }

  if (!data || typeof data !== 'object') {
    return { ok: false, failure: classifySupabaseError({ message: 'Réponse invalide' }, status) };
  }

  return { ok: true, access: { admin: data.admin === true } };
}
