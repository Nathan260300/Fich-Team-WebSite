import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { REQUEST_TIMEOUT_MS } from '../lib/access';
import { classifySupabaseError, describeError, ERROR_CODES } from '../lib/supabaseErrors';

const DATA_PROJECT_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co';
const DATA_PROJECT_KEY = 'sb_publishable_5cDdiGYwiRn619gA9shx0A_tuyM1ipK';

const dataProbeClient = createClient(DATA_PROJECT_URL, DATA_PROJECT_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'fich-admin-data-probe' },
});

const SPECIFIC_MESSAGES = [
  [/last_admin/i, 'Impossible de retirer le dernier administrateur : au moins un compte ADMIN doit rester actif.'],
  [/user_not_found/i, 'Cet utilisateur est introuvable dans user_permissions.'],
  [/admin_required/i, 'Action refusée par le serveur : la permission ADMIN est requise.'],
  [/permission_change_forbidden/i, 'Modification refusée par le serveur : seule l’interface d’administration peut changer ces droits.'],
  [/invalid_(mode|value|permission)/i, 'Paramètre invalide refusé par le serveur.'],
];

export function toFailure(error, status) {
  const classified = classifySupabaseError(error, status) ?? classifySupabaseError({ message: 'Erreur inconnue' }, status);
  const raw = `${error?.message ?? ''} ${error?.details ?? ''}`;
  const specific = SPECIFIC_MESSAGES.find(([pattern]) => pattern.test(raw));
  return {
    ...classified,
    message: specific ? specific[1] : describeError(classified.code).message,
    title: describeError(classified.code).title,
  };
}

async function run(builder) {
  const { data, error, status } = await builder.abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS));
  if (error) return { data: null, failure: toFailure(error, status) };
  return { data, failure: null };
}

export const getMaintenanceState = () => run(supabase.rpc('admin_get_state'));

export const setMaintenance = (mode, enabled, message) =>
  run(supabase.rpc('admin_set_maintenance', { p_mode: mode, p_enabled: enabled, p_message: message }));

export const listPermissions = () => run(supabase.rpc('admin_list_permissions'));

export const setPermission = (userId, permission, value) =>
  run(supabase.rpc('admin_set_permission', { p_user_id: userId, p_permission: permission, p_value: value }));

export const listSettings = () => run(supabase.rpc('admin_list_settings'));

export const listAuditLog = (limit = 100) =>
  run(supabase.from('admin_audit_log').select('id, created_at, actor_id, actor_label, action, target, details').order('created_at', { ascending: false }).limit(limit));

async function timedProbe(execute) {
  const startedAt = performance.now();
  const { error, status } = await execute();
  const latency = Math.round(performance.now() - startedAt);
  if (!error) return { available: true, latency, failure: null };
  const classified = classifySupabaseError(error, status);
  const reachable = classified && !classified.global;
  return { available: Boolean(reachable), latency, failure: reachable ? null : toFailure(error, status) };
}

export const probeCentralProject = () =>
  timedProbe(() => supabase.rpc('get_site_state').abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS)));

export const probeDataProject = () =>
  timedProbe(() => dataProbeClient.from('members').select('*', { head: true }).limit(1).abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS)));

export const isPermissionFailure = (failure) => failure?.code === ERROR_CODES.SUPABASE_PERMISSION_DENIED;
