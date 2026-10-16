import { supabase } from './supabase';
import { supabaseCentralAnon } from './supabaseCentral';
import { classifySupabaseError, isGlobalFailure, isMissingFunctionError, ERROR_CODES } from './supabaseErrors';

let state = { failure: null, generation: 0, retrying: false, retryFailed: false };
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach(listener => listener());
}

export function subscribeServiceStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getServiceStatus() {
  return state;
}

async function ownOriginReachable() {
  try {
    const response = await fetch('/favicon.svg', { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(6000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function refineNetworkFailure() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  const reachable = await ownOriginReachable();
  if (!reachable || state.failure?.code !== ERROR_CODES.NETWORK_UNAVAILABLE) return;
  setState({
    failure: {
      ...state.failure,
      code: ERROR_CODES.SUPABASE_UNAVAILABLE,
      displayStatus: 503,
      retryable: true,
    },
  });
}

export function reportSupabaseError(error, { status, essential = false, forceGlobal = false, source = '' } = {}) {
  const classified = classifySupabaseError(error, status);
  if (!classified) return null;
  if (essential && (forceGlobal || isGlobalFailure(classified)) && !state.failure) {
    setState({ failure: { ...classified, source, at: Date.now() }, retryFailed: false });
    if (classified.code === ERROR_CODES.NETWORK_UNAVAILABLE) refineNetworkFailure();
  }
  return classified;
}

async function probeDataProject() {
  const { error, status } = await supabase.from('members').select('*', { head: true }).limit(1);
  return classifySupabaseError(error, status);
}

async function probeCentralProject() {
  const { error, status } = await supabaseCentralAnon.rpc('get_site_state');
  if (error && isMissingFunctionError(error)) return null;
  return classifySupabaseError(error, status);
}

export async function retryService() {
  if (state.retrying) return;
  setState({ retrying: true, retryFailed: false });
  const results = await Promise.all([probeDataProject(), probeCentralProject()]);
  const failed = results.find(isGlobalFailure);
  if (failed) {
    setState({
      retrying: false,
      retryFailed: true,
      failure: { ...failed, source: state.failure?.source ?? '', at: Date.now() },
    });
    if (failed.code === ERROR_CODES.NETWORK_UNAVAILABLE) refineNetworkFailure();
    return;
  }
  setState({ failure: null, retrying: false, retryFailed: false, generation: state.generation + 1 });
}
