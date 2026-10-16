import { createCentralClientWithToken, readStoredAccessToken, supabaseCentralAnon } from './supabaseCentral';
import { classifySupabaseError, isMissingFunctionError, ERROR_CODES } from './supabaseErrors';

const OPEN_GATE = { maintenance: { enabled: false, message: '' }, canView: true, team: false };

function normalizeMaintenance(raw) {
  return {
    enabled: raw?.enabled === true,
    message: typeof raw?.message === 'string' ? raw.message : '',
  };
}

async function readAnonymousGate() {
  const { data, error, status } = await supabaseCentralAnon.rpc('get_site_state');

  if (error) {
    if (isMissingFunctionError(error)) return { ok: true, gate: OPEN_GATE };
    return { ok: false, error, status };
  }

  const maintenance = normalizeMaintenance(data?.public_maintenance);
  return { ok: true, gate: { maintenance, canView: !maintenance.enabled, team: false } };
}

export async function fetchSiteGate() {
  const token = readStoredAccessToken();

  if (token) {
    const { data, error, status } = await createCentralClientWithToken(token).rpc('get_my_access');

    if (!error && data) {
      const team = data.fich === true || data.admin === true;
      return {
        ok: true,
        gate: {
          maintenance: normalizeMaintenance(data.public_maintenance),
          canView: data.can_view_public_site === true,
          team,
        },
      };
    }

    const classified = classifySupabaseError(error, status);
    const sessionRejected = classified && [
      ERROR_CODES.SUPABASE_AUTH_ERROR,
      ERROR_CODES.SUPABASE_PERMISSION_DENIED,
    ].includes(classified.code);
    const missingFunction = isMissingFunctionError(error);

    if (!sessionRejected && !missingFunction) {
      return { ok: false, error, status };
    }
  }

  return readAnonymousGate();
}
