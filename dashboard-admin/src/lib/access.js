import { supabase } from './supabase';
import { classifySupabaseError, ERROR_CODES } from './supabaseErrors';

export const REQUEST_TIMEOUT_MS = 12000;

function normalizeMaintenance(raw) {
  return {
    enabled: raw?.enabled === true,
    message: typeof raw?.message === 'string' ? raw.message : '',
  };
}

function normalizeAccess(raw) {
  return {
    has_row: raw.has_row === true,
    fich: raw.fich === true,
    admin: raw.admin === true,
    dashboards_maintenance: normalizeMaintenance(raw.dashboards_maintenance),
    public_maintenance: normalizeMaintenance(raw.public_maintenance),
    dashboards_blocked: raw.dashboards_blocked === true,
    can_view_public_site: raw.can_view_public_site === true,
  };
}

export async function fetchMyAccess() {
  const { data, error, status } = await supabase
    .rpc('get_my_access')
    .abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS));

  if (error) {
    return { ok: false, failure: classifySupabaseError(error, status) };
  }

  if (!data || typeof data !== 'object') {
    return { ok: false, failure: classifySupabaseError({ message: 'Réponse invalide' }, status) };
  }

  return { ok: true, access: normalizeAccess(data) };
}

export function isSessionFailure(failure) {
  return failure?.code === ERROR_CODES.SUPABASE_AUTH_ERROR;
}
