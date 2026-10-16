import { supabaseCentral } from './supabaseCentral';
import { classifySupabaseError } from './supabaseErrors';

export const REQUEST_TIMEOUT_MS = 12000;

function normalizeMaintenance(raw) {
  return {
    enabled: raw?.enabled === true,
    message: typeof raw?.message === 'string' ? raw.message : '',
  };
}

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

  return {
    ok: true,
    access: {
      has_row: data.has_row === true,
      fich: data.fich === true,
      admin: data.admin === true,
      dashboards_maintenance: normalizeMaintenance(data.dashboards_maintenance),
      dashboards_blocked: data.dashboards_blocked === true,
    },
  };
}
